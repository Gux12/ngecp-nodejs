/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.JSONIndexLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

	this.withCredentials = false;

};

THREE.JSONIndexLoader.prototype = Object.create( THREE.Loader.prototype );
THREE.JSONIndexLoader.prototype.constructor = THREE.JSONIndexLoader;

THREE.JSONIndexLoader.prototype.load = function ( url, callback, texturePath ) {

	// todo: unify load API to for easier SceneLoader use

	//console.warn('load url:', url);
	texturePath = texturePath && ( typeof texturePath === 'string' ) ? texturePath : this.extractUrlBase( url );

	this.onLoadStart();
	this.loadAjaxJSON( this, url, callback, texturePath );

};

THREE.JSONIndexLoader.prototype.loadAjaxJSON = function ( context, url, callback, texturePath, callbackProgress ) {

	var xhr = new XMLHttpRequest();

	var length = 0;

	xhr.onreadystatechange = function () {

		if ( xhr.readyState === xhr.DONE ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				if ( xhr.responseText ) {

					var json = JSON.parse( xhr.responseText );
					callback( json );

				} else {

					THREE.error( 'THREE.JSONIndexLoader: ' + url + ' seems to be unreachable or the file is empty.' );

				}

				// in context of more complex asset initialization
				// do not block on single failed file
				// maybe should go even one more level up

				context.onLoadComplete();

			} else {

				THREE.error( 'THREE.JSONIndexLoader: Couldn\'t load ' + url + ' (' + xhr.status + ')' );

			}

		} else if ( xhr.readyState === xhr.LOADING ) {

			if ( callbackProgress ) {

				if ( length === 0 ) {

					length = xhr.getResponseHeader( 'Content-Length' );

				}

				callbackProgress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState === xhr.HEADERS_RECEIVED ) {

			if ( callbackProgress !== undefined ) {

				length = xhr.getResponseHeader( 'Content-Length' );

			}

		}

	};

	xhr.open( 'GET', url, true );
	xhr.withCredentials = this.withCredentials;
	xhr.send( null );

};