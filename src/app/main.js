import { DiscordSDK } from '@discord/embedded-app-sdk'
import './style.css'

// Will eventually store the authenticated user's access_token
let auth

// Instantiate the SDK
const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID)

setupDiscordSdk().then(() => {
	console.log('Discord SDK is authenticated')
	showGameSelection()
})

async function setupDiscordSdk() {
	await discordSdk.ready()
	console.log('Discord SDK is ready')

	// Authorize with Discord Client
	const { code } = await discordSdk.commands.authorize({
		client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
		response_type: 'code',
		state: '',
		prompt: 'none',
		scope: ['identify', 'guilds']
	})

	// Retrieve an access_token from your activity's server
	const response = await fetch('/.proxy/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			code
		})
	})
	const { access_token } = await response.json()

	// Authenticate with Discord client (using the access_token)
	auth = await discordSdk.commands.authenticate({
		access_token
	})

	if (auth == null) {
		throw new Error('Authenticate command failed')
	}
}

function showGameSelection() {
	document.querySelector('#app').innerHTML = `
		<div class="game-selection">
			<h1>Select a Game</h1>
			<div class="games-grid">
				<div class="game-card" data-game="The Gray Garden">
					<h2>The Gray Garden</h2>
					<p>The original Gray Garden adventure</p>
				</div>
				<div class="game-card" data-game="Another Side of Flames (BADLY TRANSLATED)">
					<h2>Another Side of Flames</h2>
					<p>A different perspective on the story</p>
				</div>
			</div>
		</div>
	`

	// Add click handlers for game selection
	document.querySelectorAll('.game-card').forEach(card => {
		card.addEventListener('click', () => {
			const gameName = card.dataset.game
			launchGame(gameName)
		})
	})
}

function launchGame(gameName) {
	// Hide the game selection and show the game container
	document.querySelector('#app').style.display = 'none'
	document.getElementById('viewport').style.display = 'block'
	
	// Set the game parameter in the URL for EasyRPG to pick up
	const gameUrl = `/games/${encodeURIComponent(gameName)}`
	
	// Use the global loadEasyRPGGame function from index.html
	if (window.loadEasyRPGGame) {
		window.loadEasyRPGGame(gameUrl)
	} else {
		console.error('EasyRPG loader not available')
	}
}
