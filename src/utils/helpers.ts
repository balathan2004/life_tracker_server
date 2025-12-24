import ShortUniqueId from "short-unique-id";


export const generateUUID = (length?: number) => {
    const { randomUUID } = new ShortUniqueId({ length: length || 12 });

    return randomUUID()

}