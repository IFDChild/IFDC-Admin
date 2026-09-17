import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './screens.css';
import './Overview.css';
import { getBlogs } from '../services/blogService';
import { getAllNews } from '../services/newsService';
import { getVolunteers } from '../services/volunteerService';
import { getResources } from '../services/resourceService';
import { getContactMessages, getPartnerInquiries } from '../services/inboxService';
import { getDonationRequests } from '../services/donationService';
import useSessionUser, { displayNameFor } from '../hooks/useSessionUser';

// The API stores naive UTC timestamps.
const toDate = (value) => {
  if (!value) return null;
  const date = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const timeAgo = (value) => {
  const date = toDate(value);
  if (!date) return '';
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [unit, size] of units) {
    const n = Math.floor(seconds / size);
    if (n >= 1) return `${n} ${unit}${n > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const SOURCES = {
  blogs: getBlogs,
  news: getAllNews,
  volunteers: () => getVolunteers(),
  resources: getResources,
  contact: getContactMessages,
  partners: getPartnerInquiries,
  donations: getDonationRequests
};

const QUICK_ACTIONS = [
  { to: '/news/new', icon: 'newspaper', label: 'Add News' },
  { to: '/blogs/new', icon: 'edit_note', label: 'Write Blog' },
  { to: '/resources', icon: 'upload_file', label: 'Upload Resource' },
  { to: '/volunteers', icon: 'how_to_reg', label: 'Review Volunteers' }
];

function StatTile({ icon, label, value, detail, tone, to, loading }) {
  const body = (
    <>
      <div className="ov-stat-top">
        <span className={`ov-stat-icon ${tone}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </span>
        {to && <span className="material-symbols-outlined ov-stat-arrow" aria-hidden="true">arrow_outward</span>}
      </div>
      <p className="ov-stat-label">{label}</p>
      <p className="ov-stat-value">{loading ? <span className="ov-skeleton ov-skeleton-number" /> : value}</p>
      <p className="ov-stat-detail">{loading ? <span className="ov-skeleton ov-skeleton-text" /> : detail}</p>
    </>
  );

  return to ? <Link to={to} className="ov-stat">{body}</Link> : <div className="ov-stat">{body}</div>;
}

function Panel({ title, icon, action, children }) {
  return (
    <section className="ov-panel">
      <header className="ov-panel-head">
        <h2>
          <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
          {title}
        </h2>
        {action}
      </header>
      {children}
    </section>
  );
}

function EmptyRow({ icon, text }) {
  return (
    <div className="ov-empty">
      <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
      <p>{text}</p>
    </div>
  );
}

const Overview = () => {
  const user = useSessionUser();
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const keys = Object.keys(SOURCES);

    Promise.allSettled(keys.map((key) => SOURCES[key]())).then((results) => {
      if (cancelled) return;
      const nextData = {};
      const nextErrors = {};
      results.forEach((result, index) => {
        const key = keys[index];
        if (result.status === 'fulfilled') {
          nextData[key] = Array.isArray(result.value) ? result.value : [];
        } else {
          nextData[key] = [];
          nextErrors[key] = result.reason?.message || 'Failed to load';
        }
      });
      setData(nextData);
      setErrors(nextErrors);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const { blogs = [], news = [], volunteers = [], resources = [], contact = [], partners = [], donations = [] } = data;
    const count = (list, predicate) => list.filter(predicate).length;
    return {
      newsPublished: count(news, (n) => n.status === 'published'),
      newsDrafts: count(news, (n) => n.status !== 'published'),
      blogsPublished: count(blogs, (b) => b.status === 'published'),
      blogDrafts: count(blogs, (b) => b.status !== 'published'),
      volunteersTotal: volunteers.length,
      volunteersPending: count(volunteers, (v) => v.status === 'new' || v.status === 'reviewing'),
      volunteersApproved: count(volunteers, (v) => v.status === 'accepted'),
      resourcesPublished: count(resources, (r) => r.status === 'published'),
      downloads: resources.reduce((sum, r) => sum + (r.downloads || 0), 0),
      newMessages: count(contact, (m) => m.status === 'new'),
      newInquiries: count(partners, (p) => p.status === 'new'),
      newDonations: count(donations, (d) => d.status === 'new')
    };
  }, [data]);

  const pendingVolunteers = useMemo(
    () => (data.volunteers || [])
      .filter((v) => v.status === 'new' || v.status === 'reviewing')
      .sort((a, b) => (toDate(a.created_at) || 0) - (toDate(b.created_at) || 0))
      .slice(0, 5),
    [data.volunteers]
  );

  const inbox = useMemo(() => {
    const messages = (data.contact || []).map((m) => ({
      key: `contact-${m.id}`, icon: 'mail', title: m.subject, who: m.name, status: m.status, at: m.created_at, kind: 'Contact'
    }));
    const inquiries = (data.partners || []).map((p) => ({
      key: `partner-${p.id}`, icon: 'handshake', title: p.partnership_type, who: `${p.contact_person} · ${p.organization_name}`, status: p.status, at: p.created_at, kind: 'Partnership'
    }));
    const donationOffers = (data.donations || []).map((d) => ({
      key: `donation-${d.id}`, icon: 'volunteer_activism', title: 'Willing to donate', who: d.name ? `${d.name} · ${d.email}` : d.email, status: d.status, at: d.created_at, kind: 'Donation'
    }));
    return [...donationOffers, ...messages, ...inquiries]
      .sort((a, b) => (toDate(b.at) || 0) - (toDate(a.at) || 0))
      .slice(0, 5);
  }, [data.contact, data.partners, data.donations]);

  const activity = useMemo(() => {
    const items = [
      ...(data.news || []).map((n) => ({
        key: `news-${n.id}`, icon: 'newspaper', tone: 'navy',
        text: <>News <strong>“{n.title}”</strong> {n.status === 'published' ? 'published' : 'saved as draft'}</>,
        at: n.status === 'published' ? n.published_at : n.created_at
      })),
      ...(data.blogs || []).map((b) => ({
        key: `blog-${b.id}`, icon: 'edit_note', tone: 'yellow',
        text: <>Blog <strong>“{b.title}”</strong> {b.status === 'published' ? 'published' : 'saved as draft'}{b.author ? ` · ${b.author}` : ''}</>,
        at: b.status === 'published' ? b.published_at : b.created_at
      })),
      ...(data.volunteers || []).map((v) => ({
        key: `vol-${v.id}`, icon: 'person_add', tone: 'green',
        text: <>Volunteer application from <strong>{v.first_name} {v.last_name}</strong></>,
        at: v.created_at
      })),
      ...(data.resources || []).map((r) => ({
        key: `res-${r.id}`, icon: 'description', tone: 'blue',
        text: <>Resource <strong>“{r.title}”</strong> added for {r.audience}</>,
        at: r.created_at
      }))
    ];
    return items
      .filter((item) => toDate(item.at))
      .sort((a, b) => toDate(b.at) - toDate(a.at))
      .slice(0, 8);
  }, [data]);

  const audiences = useMemo(() => {
    const counts = {};
    (data.resources || []).forEach((r) => {
      counts[r.audience] = (counts[r.audience] || 0) + 1;
    });
    const max = Math.max(1, ...Object.values(counts));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([audience, n]) => ({ audience, n, pct: Math.round((n / max) * 100) }));
  }, [data.resources]);

  const topDownloads = useMemo(
    () => [...(data.resources || [])]
      .filter((r) => (r.downloads || 0) > 0)
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 5),
    [data.resources]
  );

  const failedSources = Object.keys(errors);
  const attentionCount = stats.volunteersPending + stats.newMessages + stats.newInquiries + stats.newDonations;

  return (
    <div className="page-container ov">
      {/* ── Welcome banner ── */}
      <section className="ov-hero">
        <div className="ov-hero-text">
          <p className="ov-hero-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1>{greeting()}, {displayNameFor(user)}</h1>
          <p className="ov-hero-sub">
            {loading
              ? 'Loading the latest from the IFDC website…'
              : attentionCount > 0
                ? `${attentionCount} ${attentionCount === 1 ? 'item needs' : 'items need'} your attention today.`
                : 'You’re all caught up — nothing is waiting for review.'}
          </p>
        </div>
        <nav className="ov-actions" aria-label="Quick actions">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.to + action.label} to={action.to} className="ov-action">
              <span className="material-symbols-outlined" aria-hidden="true">{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </nav>
      </section>

      {failedSources.length > 0 && !loading && (
        <div className="ov-warning" role="status">
          <span className="material-symbols-outlined" aria-hidden="true">warning</span>
          Some figures couldn’t be loaded ({failedSources.join(', ')}). Check the API server and refresh.
        </div>
      )}

      {/* ── Stats ── */}
      <div className="ov-stats">
        <StatTile
          icon="newspaper" tone="navy" label="News articles" to="/news" loading={loading}
          value={stats.newsPublished}
          detail={stats.newsDrafts ? `${stats.newsDrafts} draft${stats.newsDrafts > 1 ? 's' : ''}` : 'All published'}
        />
        <StatTile
          icon="edit_note" tone="yellow" label="Blog posts" to="/blogs" loading={loading}
          value={stats.blogsPublished}
          detail={stats.blogDrafts ? `${stats.blogDrafts} draft${stats.blogDrafts > 1 ? 's' : ''}` : 'All published'}
        />
        <StatTile
          icon="group" tone="green" label="Volunteers" to="/volunteers" loading={loading}
          value={stats.volunteersTotal}
          detail={stats.volunteersPending ? `${stats.volunteersPending} awaiting review` : `${stats.volunteersApproved} approved`}
        />
        <StatTile
          icon="folder_shared" tone="blue" label="Resources" to="/resources" loading={loading}
          value={stats.resourcesPublished}
          detail={`${stats.downloads.toLocaleString()} download${stats.downloads === 1 ? '' : 's'}`}
        />
        <StatTile
          icon="inbox" tone="red" label="New enquiries" to="/donations" loading={loading}
          value={stats.newMessages + stats.newInquiries + stats.newDonations}
          detail={`${stats.newDonations} donation · ${stats.newMessages} contact · ${stats.newInquiries} partner`}
        />
      </div>

      {/* ── Main grid ── */}
      <div className="ov-grid">
        <div className="ov-col">
          <Panel
            title="Volunteers awaiting review"
            icon="how_to_reg"
            action={<Link to="/volunteers" className="ov-link">View all</Link>}
          >
            {loading ? (
              <div className="ov-list-skeleton"><span /><span /><span /></div>
            ) : pendingVolunteers.length === 0 ? (
              <EmptyRow icon="task_alt" text="No applications waiting. New applications from the website will appear here." />
            ) : (
              <ul className="ov-list">
                {pendingVolunteers.map((v) => (
                  <li key={v.id}>
                    <span className="ov-avatar">{`${v.first_name?.[0] || ''}${v.last_name?.[0] || ''}`.toUpperCase()}</span>
                    <div className="ov-list-main">
                      <p className="ov-list-title">{v.first_name} {v.last_name}</p>
                      <p className="ov-list-sub">{(v.interests || []).slice(0, 2).join(', ') || v.describes} · applied {timeAgo(v.created_at)}</p>
                    </div>
                    <Link to={`/volunteers/review/${v.id}`} className="ov-pill-btn">Review</Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Recent activity" icon="history">
            {loading ? (
              <div className="ov-list-skeleton"><span /><span /><span /><span /></div>
            ) : activity.length === 0 ? (
              <EmptyRow icon="history" text="No activity yet." />
            ) : (
              <ol className="ov-timeline">
                {activity.map((item) => (
                  <li key={item.key}>
                    <span className={`ov-timeline-icon ${item.tone}`}>
                      <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
                    </span>
                    <div>
                      <p className="ov-timeline-text">{item.text}</p>
                      <p className="ov-timeline-time">{timeAgo(item.at)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>

        <div className="ov-col">
          <Panel title="Inbox" icon="inbox" action={<Link to="/donations" className="ov-link">Donations</Link>}>
            {loading ? (
              <div className="ov-list-skeleton"><span /><span /></div>
            ) : inbox.length === 0 ? (
              <EmptyRow icon="mark_email_read" text="No donation requests, contact messages, or partnership enquiries yet." />
            ) : (
              <ul className="ov-list">
                {inbox.map((item) => (
                  <li key={item.key}>
                    <span className="ov-avatar soft">
                      <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
                    </span>
                    <div className="ov-list-main">
                      <p className="ov-list-title">{item.title}</p>
                      <p className="ov-list-sub">{item.kind} · {item.who} · {timeAgo(item.at)}</p>
                    </div>
                    {item.status === 'new' && <span className="ov-new-dot">New</span>}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Resource library"
            icon="folder_shared"
            action={<Link to="/resources" className="ov-link">Manage</Link>}
          >
            {loading ? (
              <div className="ov-list-skeleton"><span /><span /><span /></div>
            ) : audiences.length === 0 ? (
              <EmptyRow icon="upload_file" text="No resources uploaded yet." />
            ) : (
              <>
                <p className="ov-subhead">By audience</p>
                <ul className="ov-bars">
                  {audiences.map((row) => (
                    <li key={row.audience}>
                      <div className="ov-bar-label">
                        <span>{row.audience}</span>
                        <strong>{row.n}</strong>
                      </div>
                      <div className="ov-bar-track"><span style={{ width: `${row.pct}%` }} /></div>
                    </li>
                  ))}
                </ul>

                <p className="ov-subhead">Most downloaded</p>
                {topDownloads.length === 0 ? (
                  <p className="ov-muted">No downloads recorded yet.</p>
                ) : (
                  <ol className="ov-ranked">
                    {topDownloads.map((r, index) => (
                      <li key={r.id}>
                        <span className="ov-rank">{index + 1}</span>
                        <span className="ov-ranked-title">{r.title}</span>
                        <span className="ov-ranked-count">{r.downloads}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default Overview;
