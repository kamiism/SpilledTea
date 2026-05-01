const getEnv = (key) => {
    const value = import.meta.env[key];
    return typeof value === "string" && value.trim() !== "" ? value : undefined;
};

const conf = {
    appwriteUrl: getEnv("VITE_APPWRITE_URL"),
    appwriteProjectId: getEnv("VITE_APPWRITE_PROJECT_ID"),
    appwriteDatabaseId: getEnv("VITE_APPWRITE_DATABASE_ID"),
    appwriteTableId: getEnv("VITE_APPWRITE_TABLE_ID"),
    appwriteBucketId: getEnv("VITE_APPWRITE_BUCKET_ID")
};

const missingKeys = Object.entries(conf)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (missingKeys.length) {
    throw new Error(
        `Missing required environment variables: ${missingKeys.join(", ")}`
    );
}

export default conf;