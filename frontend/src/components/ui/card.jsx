// src/components/ui/card.jsx
import * as React from "react"
import PropTypes from 'prop-types'

const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
        {...props}
    />
))

Card.propTypes = {
    className: PropTypes.string
}

Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`flex flex-col space-y-1.5 p-6 ${className}`}
        {...props}
    />
))

CardHeader.propTypes = {
    className: PropTypes.string
}

CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
        {...props}
    />
))

CardTitle.propTypes = {
    className: PropTypes.string
}

CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
))

CardContent.propTypes = {
    className: PropTypes.string
}

CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
