//
//  characterLimit.js
//  InfomaniakRichHTMLEditor
//
//  Created by Ahmet Emre Boyacı on 10.12.2025.
//


(function() {
    if (window.__characterLimitInstalled) return;
    window.__characterLimitInstalled = true;

    // The Swift side will inject this value dynamically.
    // We replace it with a placeholder that Swift will fill.
    const MAX_LENGTH = 5000;

    function getCurrentLength() {
        let html = document.body.innerHTML;

        // Remove all tags
        html = html.replace(/<[^>]+>/g, "");

        // Decode entities
        html = html.replace(/&nbsp;/g, " ");
        html = html.replace(/&amp;/g, "&");
        html = html.replace(/&lt;/g, "<");
        html = html.replace(/&gt;/g, ">");
        html = html.replace(/&quot;/g, "\"");
        html = html.replace(/&#39;/g, "'");

        // Trim and collapse whitespace
        html = html.replace(/\s+/g, " ").trim();

        return html.length;
    }

    document.addEventListener("beforeinput", function(event) {
        const type = event.inputType;

        // Allow deletion
        if (type.startsWith("delete")) return;

        const current = getCurrentLength();
        const insert = (event.data || "").length;

        if (current + insert > MAX_LENGTH) {
            event.preventDefault();
        }
    });

    document.addEventListener("paste", function(event) {
        const current = getCurrentLength();
        const paste = (event.clipboardData || window.clipboardData).getData("text");

        if (current + paste.length > MAX_LENGTH) {
            event.preventDefault();

            const available = MAX_LENGTH - current;
            if (available > 0) {
                const truncated = paste.substring(0, available);
                document.execCommand("insertText", false, truncated);
            }
        }
    });
})();
