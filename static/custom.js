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

//text animation PSsst
	var bounce = $('#tlt');
	bounce.textillate({
			in: {
	 			effect: 'wobble', 
	 			delay: 10
	 		}
	})

	var doIt = bounce.data('textillate')
	bounce.mouseover(function() {
		doIt.start();
	})

// Slide right
	$('#log').click(function(){
		var maybeNone = $("#slideRight").css('display')
		console.log(close)

		if (maybeNone === 'none'){
			$('#slideRight').animate( {
				left:'50%',
			},
				500
			).css('display', 'block'
			)}

		if (maybeNone === 'block'){
			$('#slideRight').animate({
				left:'100%',
			},
				500, function(){
					$('#slideRight').css('display', 'none')
				}
		)}

	})




})