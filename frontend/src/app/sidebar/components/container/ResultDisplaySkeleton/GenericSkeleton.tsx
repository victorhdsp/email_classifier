// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ResultItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function GenericSkeleton(props: ResultItemProps) {
  return (
    <div
      {...props}
      className={`animate-pulse bg-gray-200 rounded-md ${props.className || 'h-4 w-full'}`}
    />
  )
}
