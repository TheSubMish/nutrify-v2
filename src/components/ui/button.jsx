const Button = ({ children, variant = "primary", className = "", ...props }) => {
    const baseStyles =
      "inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
    const variantStyles = {
      primary: "btn-primary",
      secondary: "btn-secondary",
    }
  
    const sizeStyles = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md",
    }
  
    const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles.default} ${className}`
  
    return (
      <button className={buttonStyles} {...props}>
        {children}
      </button>
    )
}
  
export default Button
  