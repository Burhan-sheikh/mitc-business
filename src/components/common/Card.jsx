import { motion } from 'framer-motion'
import clsx from 'clsx'

const Card = ({
  children,
  hover = false,
  padding = 'default',
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  }

  const classes = clsx(
    'card',
    hover && 'card-hover',
    paddingClasses[padding],
    className
  )

  const CardComponent = hover ? motion.div : 'div'
  const motionProps = hover
    ? {
        whileHover: { y: -4 },
        transition: { duration: 0.2 },
      }
    : {}

  return (
    <CardComponent className={classes} {...motionProps} {...props}>
      {children}
    </CardComponent>
  )
}

export default Card
