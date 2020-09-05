const {google} = require(`googleapis`)
const {oAuth2} = google.auth

const oAuth2Client = new OAuth2(`413161148313-ned615lolvcm7l4lbrv305t9ls9ssc1k.apps.googleusercontent.com`,`BObxFuIGd6rmSHtAccORNyPB`)


oAuth2Client.setCredentials({
    refresh_token:"1//04wnAoYCFYFuACgYIARAAGAQSNwF-L9Ir9a2X6EIpNPyjto4XgQgNkTtf0TjOLi4_CpIdbinEE4sMQvDmxp5Et_Sbo1iLDu2pv_o"
})


const calendar = google.calendar({
    version:"v3",
    auth: oAuth2Client
})

//Ini input untuk ngetes aja apa GCalendarnya bisa atau enggak, seharusnya input ini didapat dari Body form
const eventStarTime = new Date ()

eventStarTime.setDate(eventStarTime.getDay() + 2)

const eventEndTime = new Date ()
eventEndTime.setDate(eventEndTime.getDate + 2)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

const event = {
    title: "Makan-makan bareng temen kantur",
    description: "Acara makan-makan bersama owner, YEYY!!",
    start:{
        dateTime: eventStarTime,
        timeZone: "Indonesia/Jakarta"
    },
    end:{
        dateTime: eventEndTime,
        timeZone: "Indonesia/Jakarta"
    },
    colorId:8,
}

calendar.freebusy.query({
    resource:{
        timeMin: eventStarTime,
        timeMax:eventEndTime,
        timeZone: "Indonesia/Jakarta",
        items: [{id:"primary"}],
    }
},
    (err,res)=>{
        if(err){
            console.error(`Free Busy Query Error: ${err}`)
        }
        else{
            const eventsArr = res.data.calendars.primary.busy
        }
        if(eventsArr.length === 0){
            calendar.events.insert({calendarId:"primary",resource: event},
            err =>{
                if(err){
                    console.error(`Calendar Event Creation Error: ${err}`)
                }
                else{
                    console.log(`Calendar Event Created`)
                }
            })
            console.log("Jadwal penuh di hari tersebut")
        }
    }
)