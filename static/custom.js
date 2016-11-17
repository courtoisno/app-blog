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

//text animation PSsst ! 
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

// Slide right -> LOG IN ///INDEX

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

//slide riggt --> register //// INDEX

$('#reg').click(function(){
		var maybeNone = $("#slideRR").css('display')
		console.log(close)

		if (maybeNone === 'none'){
			$('#slideRR').animate( {
				left:'50%',
			},
				500
			).css('display', 'block'
			)}

		if (maybeNone === 'block'){
			$('#slideRR').animate({
				left:'100%',
			},
				500, function(){
					$('#slideRR').css('display', 'none')
				}
		)}

	})



$('#ptg').click(function(){
		var maybeNonel = $("#slidePosts").css('display')
		console.log('close')
		console.log(maybeNonel)
		if (maybeNonel === 'none'){
			$('#slidePosts').animate( {
				left:'50%',
			},
				500
			).css('display', 'block'
			)}

		if (maybeNonel === 'block'){
			$('#slidePosts').animate({
				left:'100%',
			},
				500, function(){
					$('#slidePosts').css('display', 'none')
				}
		)}

	})


//empty inputS
$('.username').val('Lara Croft')

$('.password').val('**********')

$('.username2').val('Lara Croft')

$('.email').val('Lara@croft.com')

$('.email2').val('Lara@croft.com')




