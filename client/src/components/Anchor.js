
export default ({onClick, className, children}) => {
  return <a onClick={onClick} className={className + " anchor"}>{children}</a>
}