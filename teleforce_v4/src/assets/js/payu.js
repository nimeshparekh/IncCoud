var host = window.location.hostname;
$('#payment_form').bind('keyup blur', function(){
    //alert($('#pinfo').val())
	$.ajax({
          url: 'http://'+host+':8000/api/payment/gethash',
          type: 'post',
          data: JSON.stringify({ 
			txnid: $('#txnid').val(),
			amount: $('#amount').val(),
		    pinfo: $('#pinfo').val(),
            fname: $('#fname').val(),
            email: $('#email').val(),
            mobile: $('#mobile').val(),
            address1: $('#address').val(),
            state: $('#state').val(),
			udf5: $('#udf5').val(),
            udf1: $('#udf1').val()
          }),
		  contentType: "application/json",
          dataType: 'json',
          success: function(json) {    
            //alert(json)        
			$('#hash').val(json);            
          }
    }); 
});

function launchBOLT()
{
	bolt.launch({
	key: $('#key').val(),
	txnid: $('#txnid').val(), 
	hash: $('#hash').val(),
	amount: $('#amount').val(),
	firstname: $('#fname').val(),
	email: $('#email').val(),
	phone: $('#mobile').val(),
	productinfo: $('#pinfo').val(),
    address1: $('#address').val(),
    state: $('#state').val(),
    udf5: $('#udf5').val(),
    udf1: $('#udf1').val(),
	surl : $('#surl').val(),
	furl: $('#surl').val()
    },{ responseHandler: function(BOLT){
        //console.log( BOLT.response );		
        if(BOLT.response.txnStatus != 'CANCEL')
        {
            var fr = '<form action=\"'+$('#surl').val()+'\" method=\"post\">' +
            '<input type=\"hidden\" name=\"pgtype\" value=\"'+BOLT.response.PG_TYPE+'\" />' +
            '<input type=\"hidden\" name=\"date\" value=\"'+BOLT.response.addedon+'\" />' +
            '<input type=\"hidden\" name=\"bank_ref_num\" value=\"'+BOLT.response.bank_ref_num+'\" />' +
            '<input type=\"hidden\" name=\"payuMoneyId\" value=\"'+BOLT.response.payuMoneyId+'\" />' +
            '<input type=\"hidden\" name=\"txnid\" value=\"'+BOLT.response.txnid+'\" />' +
            '<input type=\"hidden\" name=\"txnStatus\" value=\"'+BOLT.response.txnStatus+'\" />' +
            '<input type=\"hidden\" name=\"amount\" value=\"'+BOLT.response.amount+'\" />' +
            '<input type=\"hidden\" name=\"productinfo\" value=\"'+BOLT.response.productinfo+'\" />' +
            '<input type=\"hidden\" name=\"firstname\" value=\"'+BOLT.response.firstname+'\" />' +
            '<input type=\"hidden\" name=\"email\" value=\"'+BOLT.response.email+'\" />' +
            '<input type=\"hidden\" name=\"phone\" value=\"'+BOLT.response.phone+'\" />' +
            '<input type=\"hidden\" name=\"address\" value=\"'+BOLT.response.address1+'\" />' +
            '<input type=\"hidden\" name=\"state\" value=\"'+BOLT.response.state+'\" />' +
            '<input type=\"hidden\" name=\"udf5\" value=\"'+BOLT.response.udf5+'\" />' +
            '<input type=\"hidden\" name=\"udf1\" value=\"'+BOLT.response.udf1+'\" />' +
            '<input type=\"hidden\" name=\"mihpayid\" value=\"'+BOLT.response.mihpayid+'\" />' +
            '<input type=\"hidden\" name=\"status\" value=\"'+BOLT.response.status+'\" />' +
            '<input type=\"hidden\" name=\"hash\" value=\"'+BOLT.response.hash+'\" />' +
            '</form>';
            var form = jQuery(fr);
            jQuery('body').append(form);								
            form.submit();
        }
    },
        catchException: function(BOLT){
            alert( BOLT.message );
        }
    });
}