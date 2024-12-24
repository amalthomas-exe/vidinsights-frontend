import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Info } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import ExplanationBox from './ExplanationBox'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus as theme } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface DetailedNotesProps {
    detailedNotes: string
}

const DetailedNotes: React.FC<DetailedNotesProps> = ({ detailedNotes }) => {
    const [selectedText, setSelectedText] = useState<string | null>(null)
    const [position, setPosition] = useState<Record<string, number>>();
    const [showExplanation, setShowExplanation] = useState<boolean>(false);

    function onSelectEnd() {
        if (window.getSelection()?.focusNode?.parentElement?.closest("#detailed-notes")?.id !== "detailed-notes") {
            setSelectedText(null);
            setShowExplanation(false);
            return;
        }

        const activeSelection = document.getSelection();
        const text = activeSelection?.toString();

        if (!activeSelection || !text || text.trim() === "") {
            setSelectedText(null);
            setShowExplanation(false);
            return;
        };

        setSelectedText(text);

        const rect = activeSelection.getRangeAt(0).getBoundingClientRect()

        setPosition({
            x: rect.left + (rect.width / 2) - (80 / 2),
            y: rect.top + window.scrollY - 30,
            width: rect.width,
            height: rect.height,
        })
    }


    useEffect(() => {
        document.addEventListener('mouseup', onSelectEnd);
        return () => {
            document.removeEventListener('mouseup', onSelectEnd);
        }
    }, [])


    return (
        <div id='detailed-notes' className='mt-10 w-full lg:w-[80%]'>
            <div role="dialog" aria-labelledby="share" aria-haspopup="dialog">
                {selectedText && position && (
                    <>
                        {!showExplanation && <p className=' absolute -top-2 left-0 w-[100px] h-[30px] bg-black text-white rounded m-0
            after:absolute after:top-full after:left-1/2 after:-translate-x-2 after:h-0 after:w-0 after:border-x-[6px] after:border-x-transparent after:border-b-[8px] after:border-b-black after:rotate-180'

                            style={{
                                transform: `translate3d(${position.x}px, ${position.y}px, 0)`
                            }}>
                            <button className="flex w-full h-full justify-between items-center px-2" onClick={() => {
                                setShowExplanation(!showExplanation)
                            }}>
                                <div className="flex flex-row items-center justify-between w-full h-full">

                                    <Info size={20} color="#ffffff" />
                                    <span id="share">Explain</span>
                                </div>
                            </button>
                        </p>}

                        {showExplanation && <ExplanationBox position={position} selectedText={selectedText} />}
                    </>
                )}
            </div>
            <Markdown className={"markdown"} remarkPlugins={[remarkGfm]} components={{
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');

                    return !inline && match ? (
                        <SyntaxHighlighter style={theme} PreTag="div" language={match[1]} {...props} 
                            customStyle={{
                                borderRadius: '0.5em',
                            }}
                            showLineNumbers={true} wrapLines={true} wrapLongLines={true} lineNumberStyle={{paddingRight: '1em'}}
                            lineNumberContainerStyle={{userSelect: 'none', paddingRight: '1em'}}
                        >   
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className={`${className}`} {...props} id='code-block'>
                            {children}
                        </code>
                    );
                },
            }}
            >
                {detailedNotes}
            </Markdown>
        </div>
    )
}

export default DetailedNotes