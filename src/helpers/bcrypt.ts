import bcrypt from 'bcryptjs';

export const hashPassword = async (data: string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data, salt);
        
        if (!hash) {
            throw new Error("Hashing failed");
        }

        return { hash } as const;
    } catch (error) {
        console.error("Error during password hashing:", error);
        throw new Error("Unable to hash data");
    }
};


export const verifyPassword = async (data: string, encryptedPass: string) => {
    const compared = await bcrypt.compare(data, encryptedPass)

    return { compared } as const
}