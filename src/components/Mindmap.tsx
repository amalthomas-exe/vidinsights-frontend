import React, { useEffect } from "react";
import mermaid from "mermaid";

interface MindMapProps {
    code: string
}

mermaid.initialize({
    startOnLoad: true,
    theme:"default"
})

const Mindmap: React.FC<MindMapProps> = ({ code }) => {

    // useEffect(() => {
    //     mermaid.contentLoaded()
    // }, [])

    useEffect(() => {
        document.getElementById("mermaidDiv")?.removeAttribute("data-processed")
        mermaid.contentLoaded()
    }, [code])

    return (
        <section className=' bg-gray-100 w-full mt-5'>
            <pre className="mermaid w-full h-[50vh] flex flex-col items-center justify-center" id="mermaidDiv">
                {code}
            </pre>
        </section>
    )
}

export default Mindmap;