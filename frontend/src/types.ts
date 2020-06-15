export interface DataSchema {
    schema: { fields: { name?: string, type?: string }[] },
    data: any[]
    additional?: {
        fields: { name?: string, type?: string }[],
        data: any
    }
}