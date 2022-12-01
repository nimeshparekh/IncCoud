var cron = require('node-cron');
var async = require("async");
const dateFormat = require ('dateformat');
var helper = require("../../../helper/common");
var urllib = require('urllib');
var Digital = require('../../../model/digital');

cron.schedule("*/10 * * * * *", function() {
    var todaysDate = dateFormat(new Date(), 'yyyy-mm-dd');
    Digital.check_ads_insights_cron(todaysDate,async function(err , rows){
        if (err) {
            console.log(err);
        }
        else{
            //console.log(rows);
            if(rows.length > 0){
                let data = rows[0]
                console.log(data.last_sync_insights);
                if (data.last_sync_insights == null) {
                    console.log("null che");
                    var count_num = await helper.fb_ads_first_insights(data)
                }else{
                    var todaysDate2 = new Date();
                    var last_at = data.last_sync_insights;
                    console.log('last_at ==> '+last_at)
                    console.log('todaysDate2 ==>'+todaysDate2)
                    if(todaysDate2 > last_at){
                       console.log(data.ads_id)
                       var like_count = await helper.fb_ads_insights(data)
                    }

                }
               
            }
            else{
                console.log("No Data for Ads Insights updates")
            }
        }
    })
})


