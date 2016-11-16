//initialize the document
$(document).ready(function() {

	//When click on the button, add comment to my db
	$("#button").click(function(event){
		event.preventDefault()


		//AJAX post request
		$.post('/singlepost', {
			comment: $('#herecom').val(),
			postId:  $('form').attr('id')
		}, function (data, stat){
			console.log(data + stat)
				//add the data to my div
  				$('#result').append( data+ '<br>')
  			
		})
	})

})