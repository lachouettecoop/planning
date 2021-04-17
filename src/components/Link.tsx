import { Link } from "react-router-dom"

const UniversalLink = ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  if (href?.startsWith("/")) {
    return <Link to={href} {...props} />
  }
  return <a href={href} {...props} />
}

export default UniversalLink
