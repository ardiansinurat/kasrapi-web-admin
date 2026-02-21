"use client"

import * as React from "react"

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
    ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
    ({ ratio = 1 / 1, style, ...props }, ref) => (
        <div
            ref={ref}
            style={{
                ...style,
                aspectRatio: `${ratio}`,
                width: "100%",
                position: "relative",
            }}
            {...props}
        />
    )
)

AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
