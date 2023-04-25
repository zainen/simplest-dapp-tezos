export const Card = (props: {children: JSX.Element[] | JSX.Element, className?: string}): JSX.Element => {
return (
<div className={"bg-orange-100 rounded-md p-4 " + props.className}>
  {props.children}
</div>)
}