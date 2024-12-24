import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface TableOfContentsProps {
    tableOfContents: any
    seekTo: (time: number) => void
}

const convertSecondsMMSS = (seconds: number) => {
    let minutes = Math.floor(seconds / 60)
    let minutesString = ""
    let remainingSecondsString = ""

    if (minutes < 10) {
        minutesString = `0${minutes}`
    }
    else {
        minutesString = `${minutes}`
    }

    let remainingSeconds = seconds % 60
    if (remainingSeconds < 10) {
        remainingSecondsString = `0${remainingSeconds}`
    }
    else {
        remainingSecondsString = `${remainingSeconds}`
    }

    return `${minutesString}:${remainingSecondsString}`
}

const TableOfContents: React.FC<TableOfContentsProps> = ({seekTo,tableOfContents}) => {
    return (
        <div className="flex flex-col mt-5">
            <h1 className="text-2xl font-semibold mt-5">Table of Contents</h1>
            <Accordion type="multiple" className="w-full h-[60vh]  overflow-y-scroll overflow-x-hidden">
                {tableOfContents.map((item: any, index: number) => (
                    <AccordionItem key={index} value={`item-${index}`} id={`accordion-${index}`} onClick={() => {
                        document.getElementById(`accordion-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: "end" })
                    }}>
                        <AccordionTrigger className='w-full'>
                            <div className="w-full flex flex-row justify-between items-center px-2">

                                <div className='font-semibold text-md '>{item.title}</div>
                                <div className='bg-slate-200 p-1 px-2 rounded-sm hover:shadow-sm' onClick={() => {
                                    seekTo(item.start)
                                }}><TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                {convertSecondsMMSS(item.start)}
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Jump to {convertSecondsMMSS(item.start)}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider></div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className='px-2'>
                            {item.description}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default TableOfContents