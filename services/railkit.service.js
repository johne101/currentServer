import { getAvailability } from "railkit";

export const checkAvailability = async ({
  train,
  from,
  to,
  date,
  coachClass,
  quota,
}) => {
  try {
    const response = await getAvailability(
      train,
      from,
      to,
      date,
      coachClass,
      quota
    );

    if (!response.success) {
      throw new Error("RailKit request failed");
    }

    return response.data;
  } catch (error) {
    console.error("RailKit Error:", error.message);
    throw error;
  }
};