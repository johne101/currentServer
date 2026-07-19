import { Expo } from "expo-server-sdk";

const expo = new Expo();

export async function sendNotification(user,status){

    await expo.sendPushNotificationsAsync([
        {
            to:user.expoPushToken,

            sound:"default",

            title:"🎉 Seat Available!",

            body:`${user.train} now has ${status}`,

            data:{
                train:user.train
            }
        }
    ]);

}