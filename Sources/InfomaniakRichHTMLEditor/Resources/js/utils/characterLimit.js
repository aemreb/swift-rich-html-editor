//
//  characterLimit.js
//  InfomaniakRichHTMLEditor
//
//  Created by Ahmet Emre Boyacı on 10.12.2025.
//


(function () {
    if (window.__characterLimitInstalled) return;
    window.__characterLimitInstalled = true;

    const MAX_LENGTH = 4950;

    // Always target the real editor node
    const editor = document.querySelector('#swift-rich-html-editor');

    function getCurrentLength() {
        if (!editor) return 0;

        // innerText is ALWAYS correct visible text
        let text = editor.innerText || "";
        text = text.replace(/\s+/g, " ").trim(); // normalize whitespace
        return text.length;
    }

    document.addEventListener('beforeinput', function (event) {
        const type = event.inputType;
        if (type.startsWith("delete")) return;

        const current = getCurrentLength();

        // event.data is null for Enter, emoji, dictation, etc.
        const incoming = (event.data || "").length;

        if (current + incoming > MAX_LENGTH) {
            event.preventDefault();
        }
    });

    document.addEventListener('paste', function (event) {
        if (!editor) return;

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
