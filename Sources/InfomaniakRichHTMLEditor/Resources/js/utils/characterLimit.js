//
//  characterLimit.js
//  InfomaniakRichHTMLEditor
//
//  Created by Ahmet Emre Boyacı on 10.12.2025.
//

(function() {
    if (window.__characterLimitInstalled) return;
    window.__characterLimitInstalled = true;

    const MAX_LENGTH = 5000;

    // Clean HTML → return visible text length
    function getCurrentLength() {
        let html = document.getElementById("swift-rich-html-editor").innerHTML;

        html = html.replace(/<[^>]+>/g, "");
        html = html.replace(/&nbsp;/g, " ");
        html = html.replace(/&amp;/g, "&");
        html = html.replace(/&lt;/g, "<");
        html = html.replace(/&gt;/g, ">");
        html = html.replace(/&quot;/g, "\"");
        html = html.replace(/&#39;/g, "'");
        html = html.replace(/\s+/g, " ").trim();

        return html.length;
    }

    const editable = document.getElementById("swift-rich-html-editor");

    if (!editable) return; // safety

    // BEFOREINPUT — main enforcement
    editable.addEventListener("beforeinput", function(event) {
        if (event.inputType.startsWith("delete")) return;

        const current = getCurrentLength();
        const insert = (event.data || "").length;

        if (current + insert > MAX_LENGTH) {
            event.preventDefault();
        }
    });

    // PASTE handler — truncate if needed
    editable.addEventListener("paste", function(event) {
        const current = getCurrentLength();
        const paste = (event.clipboardData || window.clipboardData).getData("text");

        if (current + paste.length > MAX_LENGTH) {
            event.preventDefault();

            const allowed = MAX_LENGTH - current;
            if (allowed > 0) {
                const truncated = paste.substring(0, allowed);
                document.execCommand("insertText", false, truncated);
            }
        }
    });
})();
