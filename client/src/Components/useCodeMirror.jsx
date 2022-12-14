import { useEffect, useState, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, highlightActiveLineGutter, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { languages } from "@codemirror/language-data";
import { foldGutter, foldKeymap } from "@codemirror/language";

const useCodeMirror = ({ initialDoc, initialName, onChange }) => {
    const refContainer = useRef(null);
    const [editorView, setEditorView] = useState();

    useEffect(() => {
        if (!refContainer.current) return;

        const startState = EditorState.create({
            doc: initialDoc,
            name: initialName,
            extensions: [
                keymap.of([...defaultKeymap, ...foldKeymap]),
                lineNumbers(),
                oneDark,
                EditorView.lineWrapping,
                highlightActiveLineGutter(),
                highlightActiveLine(),
                foldGutter(),
                markdown({
                    base: markdownLanguage,
                    addKeymap: true,
                    codeLanguages: languages,
                }),
                EditorView.updateListener.of((update) => {
                    if (update.changes) {
                        onChange && onChange(update.state);
                    }
                }),
            ],
        });

        const view = new EditorView({
            state: startState,
            parent: refContainer.current,
        });
        setEditorView(view);
    }, [refContainer]);

    return [refContainer, editorView];
};

export default useCodeMirror;
