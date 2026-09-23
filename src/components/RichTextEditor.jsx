import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Small HTML editor for post bodies.
 *
 * It produces the same tags the public site allows (headings, bold, italic,
 * lists, links, quotes and images), so what is written here is what readers
 * see. Pasted content is stripped to plain text to keep stray markup out.
 */

const TOOLBAR = [
    { icon: "format_bold", title: "Bold", command: "bold" },
    { icon: "format_italic", title: "Italic", command: "italic" },
    { icon: "format_underlined", title: "Underline", command: "underline" },
    null,
    { icon: "title", title: "Heading", command: "formatBlock", value: "H2" },
    { icon: "text_fields", title: "Subheading", command: "formatBlock", value: "H3" },
    { icon: "format_quote", title: "Quote", command: "formatBlock", value: "BLOCKQUOTE" },
    null,
    { icon: "format_list_bulleted", title: "Bullet list", command: "insertUnorderedList" },
    { icon: "format_list_numbered", title: "Numbered list", command: "insertOrderedList" },
    null,
    { icon: "link", title: "Add link", action: "link" },
    { icon: "link_off", title: "Remove link", command: "unlink" },
    { icon: "image", title: "Insert image", action: "image" },
    null,
    { icon: "format_clear", title: "Clear formatting", command: "removeFormat" }
];

const RichTextEditor = ({ value, onChange, onUploadImage, placeholder = "Start writing…", height = 480 }) => {
    const editorRef = useRef(null);
    const fileRef = useRef(null);
    const lastEmitted = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [active, setActive] = useState({});

    useEffect(() => {
        try {
            document.execCommand("defaultParagraphSeparator", false, "p");
        } catch {
            // older browsers keep their own default
        }
    }, []);

    // Write into the element only when the value came from outside - loading a
    // post to edit. Echoing back what we just emitted would move the caret to
    // the start on every keystroke.
    useEffect(() => {
        const el = editorRef.current;
        if (!el) return;
        if (value === lastEmitted.current) return;
        if ((value || "") === el.innerHTML) return;
        el.innerHTML = value || "";
    }, [value]);

    /** Loose text and <div> wrappers become paragraphs, which is what the site renders. */
    const normalise = (el) => {
        el.querySelectorAll("div").forEach((div) => {
            if (div.closest("figure, blockquote, li")) return;
            const paragraph = document.createElement("p");
            paragraph.innerHTML = div.innerHTML;
            div.replaceWith(paragraph);
        });

        // A list or heading that landed inside a paragraph is invalid HTML.
        el.querySelectorAll("p").forEach((paragraph) => {
            if (!paragraph.querySelector("ul, ol, figure, blockquote, h2, h3, h4")) return;
            paragraph.replaceWith(...paragraph.childNodes);
        });

        [...el.childNodes].forEach((node) => {
            const isText = node.nodeType === 3 && node.textContent.trim();
            const isInline = node.nodeType === 1 && !/^(P|H2|H3|H4|UL|OL|FIGURE|BLOCKQUOTE|BR)$/.test(node.tagName);
            if (!isText && !isInline) return;

            const paragraph = document.createElement("p");
            node.replaceWith(paragraph);
            paragraph.appendChild(node);
        });
    };

    const emit = useCallback(() => {
        const el = editorRef.current;
        if (!el) return;
        normalise(el);
        const html = el.innerHTML === "<br>" || !el.textContent.trim() ? "" : el.innerHTML;
        lastEmitted.current = html;
        onChange(html);
    }, [onChange]);

    const refreshActive = useCallback(() => {
        if (typeof document.queryCommandState !== "function") return;
        const state = {};
        for (const item of TOOLBAR) {
            if (item?.command && !item.value) {
                try {
                    state[item.command] = document.queryCommandState(item.command);
                } catch {
                    state[item.command] = false;
                }
            }
        }
        setActive(state);
    }, []);

    const run = (command, commandValue = null) => {
        editorRef.current?.focus();
        document.execCommand(command, false, commandValue);
        emit();
        refreshActive();
    };

    const addLink = () => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            window.alert("Select the words you want to link first.");
            return;
        }

        const url = window.prompt("Link address", "https://");
        if (!url) return;

        const safe = /^(https?:|mailto:|tel:)/i.test(url) ? url : `https://${url}`;
        run("createLink", safe);
    };

    const insertImage = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file || !onUploadImage) return;

        setUploading(true);
        try {
            const url = await onUploadImage(file);
            editorRef.current?.focus();
            document.execCommand(
                "insertHTML",
                false,
                `<figure><img src="${url}" alt="" /></figure><p><br /></p>`
            );
            emit();
        } catch (error) {
            window.alert(error.message || "Could not upload that image.");
        } finally {
            setUploading(false);
        }
    };

    // Paste as plain text so Word and web copy do not bring their own styling.
    const handlePaste = (event) => {
        event.preventDefault();
        const text = event.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
        emit();
    };

    return (
        <div className="glass-card rte" style={{ display: "flex", flexDirection: "column", height, overflow: "hidden", padding: 0 }}>
            <div className="rte-toolbar">
                {TOOLBAR.map((item, index) =>
                    item === null ? (
                        <span key={`sep-${index}`} className="rte-separator" aria-hidden="true" />
                    ) : (
                        <button
                            key={item.icon}
                            type="button"
                            title={item.title}
                            aria-label={item.title}
                            aria-pressed={item.command ? Boolean(active[item.command]) : undefined}
                            className={`rte-button${active[item.command] ? " is-active" : ""}`}
                            disabled={item.action === "image" && uploading}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                if (item.action === "link") return addLink();
                                if (item.action === "image") return fileRef.current?.click();
                                return run(item.command, item.value || null);
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{item.icon}</span>
                        </button>
                    )
                )}
                {uploading && <span className="rte-uploading">Uploading…</span>}
            </div>

            <div
                ref={editorRef}
                className="rte-surface"
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label="Post content"
                data-placeholder={placeholder}
                onInput={emit}
                onBlur={emit}
                onKeyUp={refreshActive}
                onMouseUp={refreshActive}
                onPaste={handlePaste}
            />

            <input ref={fileRef} type="file" accept="image/*" onChange={insertImage} style={{ display: "none" }} />
        </div>
    );
};

export default RichTextEditor;
