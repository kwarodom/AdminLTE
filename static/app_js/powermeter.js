/**

 *  Authors: Kruthika Rathinavel
 *  Version: 2.0
 *  Email: kruthika@vt.edu
 *  Created: "2014-10-13 18:45:40"
 *  Updated: "2015-02-13 15:06:41"


 * Copyright © 2014 by Virginia Polytechnic Institute and State University
 * All rights reserved

 * Virginia Polytechnic Institute and State University (Virginia Tech) owns the copyright for the BEMOSS software and its
 * associated documentation ("Software") and retains rights to grant research rights under patents related to
 * the BEMOSS software to other academic institutions or non-profit research institutions.
 * You should carefully read the following terms and conditions before using this software.
 * Your use of this Software indicates your acceptance of this license agreement and all terms and conditions.

 * You are hereby licensed to use the Software for Non-Commercial Purpose only.  Non-Commercial Purpose means the
 * use of the Software solely for research.  Non-Commercial Purpose excludes, without limitation, any use of
 * the Software, as part of, or in any way in connection with a product or service which is sold, offered for sale,
 * licensed, leased, loaned, or rented.  Permission to use, copy, modify, and distribute this compilation
 * for Non-Commercial Purpose to other academic institutions or non-profit research institutions is hereby granted
 * without fee, subject to the following terms of this license.

 * Commercial Use: If you desire to use the software for profit-making or commercial purposes,
 * you agree to negotiate in good faith a license with Virginia Tech prior to such profit-making or commercial use.
 * Virginia Tech shall have no obligation to grant such license to you, and may grant exclusive or non-exclusive
 * licenses to others. You may contact the following by email to discuss commercial use:: vtippatents@vtip.org

 * Limitation of Liability: IN NO EVENT WILL VIRGINIA TECH, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR REDISTRIBUTE
 * THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR
 * CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED TO
 * LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE
 * OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS), EVEN IF VIRGINIA TECH OR OTHER PARTY HAS BEEN ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGES.

 * For full terms and conditions, please visit https://bitbucket.org/bemoss/bemoss_os.

 * Address all correspondence regarding this license to Virginia Tech's electronic mail address:: vtippatents@vtip.org

**/

/**
 * @author kruthika
 */

    //var setHeight = $("#power_con").height();
    //$("#enrgy_con").height(setHeight+'px');


$( document ).ready(function() {
	$.csrftoken();
    var gauge_target = document.getElementById("chart_9");
    var gauge = new Gauge(gauge_target);

     var ws = new WebSocket("ws://" + window.location.host + "/socket_powermeter");

     ws.onopen = function () {
         ws.send("WS opened from html page");
     };

     ws.onmessage = function (event) {
         var _data = event.data;
         _data = $.parseJSON(_data);
         var topic = _data['topic'];
         // ["", "ui", "web", "thermostat", "999", "Wifithermostat1", "device_status", "response"]
         if (topic) {
             topic = topic.split('/');
             console.log(topic);
             if (topic[5] == device_id && topic[6] == 'device_status') {
                 if ($.type( _data['message'] ) === "string"){
                     var _message = $.parseJSON(_data['message']);
                     change_powermeter_values(_message);
                 } else if ($.type( _data['message'] ) === "object"){
                     change_powermeter_values(_data['message']);
                 }

             }
         }
     };

    /*var options = {
        grid: {
                //background: 'rgba(0, 0, 0, 0.25)'
                background: 'transparent'

            },
        seriesDefaults: {
            renderer: $.jqplot.MeterGaugeRenderer,
            rendererOptions: {
                //diameter:'400',
                background:'transparent',
                ringColor:'rgba(222, 255, 222, 0.55)',
                ringWidth: '4',
                label: 'Power (kW)',
                //intervalOuterRadius: '140',
                ticks: [0, 5, 10, 15, 20],
                tickColor: 'rgba(245, 245, 255, 1)',
                intervals:[4,10,18],
                //intervalColors:['#66cc66', '#E7E658', '#cc6666']
                intervalColors:['rgba(102, 204, 102, 0.52)', 'rgba(231, 230, 88, 0.52)', 'rgba(204, 102, 102, 0.52)']
            }
        }
    };*/

     var popts = {
                lines: 12, // The number of lines to draw
                angle: 0.0, // The length of each line
                lineWidth: 0.2, // The line thickness2
                pointer: {
                    length: 0.8, // The radius of the inner circle
                    strokeWidth: 0.03, // The rotation offset
                    color: '#00000' // Fill color
                },
                limitMax: 'true',   // If true, the pointer will not go past the end of the gauge
                colorStart: '#6FADCF',   // Colors
                colorStop: '#8FC0DA',    // just experiment with them
                strokeColor: '#E0E0E0',   // to see which ones work best for you
                generateGradient: true,
                percentColors: [
                    [0, "#a9d70b" ],
                    [10, "#f9c802"],
                    [20, "#ff0000"]
                ],
                //animationSpeed: 30,
                fontSize: 20
            };

    if (power != "") {
        //var power_val = [power];
        //var power_meter = $.jqplot('chart9', [power_val], options);
        var power_val = parseInt(power);
        gauge.setTextField(document.getElementById("9-textfield"));
        gauge.setOptions(popts);
        gauge.maxValue = 300;
        gauge.set(power_val);
    }

	function change_plugload_values(data) {

        if (data.real_power) {
            $("#power_val").text(data.real_power + " W");
            /*if (power_meter) {
                power_meter.destroy();
            }
            power_val = [data.power];
            power_meter = $.jqplot('chart9', [power_val], options);*/
            gauge.set(parseInt(data.real_power));

        }

        if (data.energy) {
            $("#energy").text(data.energy + " kWh");
        }

        if (data.reactive_power) {
            $("#reactive_power").text(data.reactive_power);
        }

        if (data.apparent_power) {
            $("#reactive_power").text(data.reactive_power);
        }

        if (data.voltage) {
            $("#voltage").text(data.voltage);
        }

        if (data.current) {
            $("#current").text(data.current);
        }

        if (data.power_factor) {
            $("#power_factor").text(data.power_factor);
        }

    }

});