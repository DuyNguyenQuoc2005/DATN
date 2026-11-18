import mongoose from "mongoose";

export const getHealth = () => {
    const databaseStatus =
        mongoose.connection.readyState === 1
            ? "connected"
            : "disconnected";

    return {
        database: databaseStatus
    };
};