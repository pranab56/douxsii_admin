import { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    height?: number;
}

const RichTextEditor = ({ value, onChange, height = 500 }: RichTextEditorProps) => {
    const editor = useRef(null);

    const config = useMemo(() => ({
        height,
        theme: 'dark',
        readonly: false,
        placeholder: '', // Remove overlapping placeholder element
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        toolbarAdaptive: false,
        style: {
            background: '#2a0008',
            color: '#ffffff',
        },
        editorStyle: {
            background: '#2a0008',
            color: '#ffffff',
        },
    }), [height]);

    return (
        <div className="jodit-theme-dark relative">
            <style>{`
                .jodit-placeholder {
                    display: none !important;
                }
                .jodit-container {
                    background: #2a0008 !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                    border-radius: 12px !important;
                    overflow: hidden;
                }
                .jodit-toolbar__box {
                    background: #3c000c !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                }
                .jodit-wysiwyg {
                    background: #2a0008 !important;
                    color: #ffffff !important;
                    padding: 16px !important;
                }
            `}</style>
            <JoditEditor
                ref={editor}
                value={value}
                config={config}
                onBlur={(newContent) => onChange(newContent)}
            />
        </div>
    );
};

export default RichTextEditor;
