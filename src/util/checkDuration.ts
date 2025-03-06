export const isExamWithinDuration = (startTime: string, endTime: string, allowedDurationInMinutes: number): boolean => {

    const start = new Date(startTime).getTime(); // Convert startTime to a timestamp
    const end = new Date(endTime).getTime(); // Convert endTime to a timestamp



    // Ensure end time is greater than start time
    if (end < start) {
        throw new Error("Invalid end time: End time is before start time.");
    }

    const duration = end - start; // Duration in milliseconds
    const allowedDurationInMs = allowedDurationInMinutes * 60 * 1000; // Convert minutes to milliseconds


    return duration <= allowedDurationInMs;
};