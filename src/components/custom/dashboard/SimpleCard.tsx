export type TSimpleCartProps = {
    title: string
    description: string
}

export default function SimpleCard({ title, description }: TSimpleCartProps) {
    return (
        <div>
            <p className="text-muted-foreground capitalize">{title}</p>
            <p className="text-lg font-semibold capitalize">{description}</p>
        </div>
    )
}
