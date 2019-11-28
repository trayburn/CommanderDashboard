import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import * as signalR from "@microsoft/signalr";

export class Dashboard extends Component {
	static displayName = Dashboard.name;

	constructor(props) {
		super(props);
		this.state = {
			currentCount: 0,
			activeTab: '1',
			players: [
				{ id: 0, name: 'Loading...', twitter: "Loading...", life: 0, p0: 0, p1: 0, p2: 0, p3: 0, cb: false, m: false },
				{ id: 1, name: 'Loading...', twitter: "Loading...", life: 0, p0: 0, p1: 0, p2: 0, p3: 0, cb: false, m: false },
				{ id: 2, name: 'Loading...', twitter: "Loading...", life: 0, p0: 0, p1: 0, p2: 0, p3: 0, cb: false, m: false },
				{ id: 3, name: 'Loading...', twitter: "Loading...", life: 0, p0: 0, p1: 0, p2: 0, p3: 0, cb: false, m: false }
			]
		};
		this.toggle = this.toggle.bind(this);
		this.sendUpdate = this.sendUpdate.bind(this);
		this.init = this.init.bind(this);

		const conn = new signalR.HubConnectionBuilder()
			.withUrl("/hub")
			.withAutomaticReconnect()
			.configureLogging(signalR.LogLevel.Information)
			.build();

		conn.start()
			.then(() => {
				console.log("connected to hub");
				this.connection = conn;
				this.init();
			})
			.catch(err => {
				console.log('Connection Level Error');
				console.error(err.toString());
			});
	}

	init() {
		this.connection.on("updatePlayer", (player, index) => {
			this.setState(state => {
				state.players[index] = player;
				return state;
			});
		});
		this.connection.invoke("GetPlayer", 0).catch(err => console.error(err.toString()));
		this.connection.invoke("GetPlayer", 1).catch(err => console.error(err.toString()));
		this.connection.invoke("GetPlayer", 2).catch(err => console.error(err.toString()));
		this.connection.invoke("GetPlayer", 3).catch(err => console.error(err.toString()));
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({ activeTab: tab });
		}
	}

	changeGameData(player, event) {
		var fullName = event.target.name;
		var propValue = null;
		if (event.target.className == "form-check-input") {
			propValue = event.target.checked;
		} else {
			propValue = new Number(event.target.value);
		}
		this.setState(state => {
			var name = fullName.split("-")[1];
			player[name] = propValue;
			this.sendUpdate(state);
			return state;
		});
	}

	changeName(player, event) {
		var name = event.target.value;
		this.setState(state => {
			player.name = name;
			this.sendUpdate(state);
			return state;
		})
	}

	changeTwitter(player, event) {
		var twitter = event.target.value;
		this.setState(state => {
			player.twitter = twitter;
			this.sendUpdate(state);
			return state;
		});
	}

	resetData(event) {
		this.setState(state => {
			state.players.map(player => {
				player.life = 40;
				player.cb = false;
				player.m = false;
				player.p0 = 0;
				player.p1 = 0;
				player.p2 = 0;
				player.p3 = 0;
				return player;
			});
			this.sendUpdate(state);
			return state;
		})
	}


	sendUpdate(state) {
		var player0 = state.players[0];
		var player1 = state.players[1];
		var player2 = state.players[2];
		var player3 = state.players[3];
		this.connection.invoke("SetPlayers", player0, player1, player2, player3)
			.catch(err => console.error(err.toString()));
	}



	render() {
		return (
			<div className="container">

				<Nav tabs>
					<NavItem>
						<NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>Player Setup</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>Game State</NavLink>
					</NavItem>
				</Nav>

				<TabContent activeTab={this.state.activeTab}>
					<TabPane tabId="1">
						<form>
							<table className="table table-striped">
								<thead className="thead-dark">
									<tr>
										<th>#</th>
										<th>Name</th>
										<th>Twitter</th>
									</tr>
								</thead>
								<tbody>
									{this.state.players.map(p =>
										<tr key={p.id}>
											<th scope="row">{p.id}</th>
											<td><input className="form-control" name={"p" + p.id + "-name"} value={p.name} onChange={this.changeName.bind(this, p)} /></td>
											<td><input className="form-control" name={"p" + p.id + "-twitter"} value={p.twitter} onChange={this.changeTwitter.bind(this, p)} /></td>
										</tr>
									)}
								</tbody>
							</table>
						</form>
					</TabPane>
					<TabPane tabId="2">
						<form>
							<table className="table table-striped">
								<thead className="thead-dark">
									<tr>
										<th>Name</th>
										<th>Life</th>
										<th>{this.state.players[0].name}</th>
										<th>{this.state.players[1].name}</th>
										<th>{this.state.players[2].name}</th>
										<th>{this.state.players[3].name}</th>
										<th>City's Blessing</th>
										<th>Monarch</th>
									</tr>
								</thead>
								<tbody>
									{this.state.players.map(p =>
										<tr key={p.id}>
											<th scope="row">{p.name}</th>
											<td><input type="numeric" className="form-control" name={"p" + p.id + "-life"} value={p.life} onChange={this.changeGameData.bind(this, p)} /></td>
											<td><input type="numeric" className="form-control" name={"p" + p.id + "-p0"} value={p.p0} onChange={this.changeGameData.bind(this, p)} /></td>
											<td><input type="numeric" className="form-control" name={"p" + p.id + "-p1"} value={p.p1} onChange={this.changeGameData.bind(this, p)} /></td>
											<td><input type="numeric" className="form-control" name={"p" + p.id + "-p2"} value={p.p2} onChange={this.changeGameData.bind(this, p)} /></td>
											<td><input type="numeric" className="form-control" name={"p" + p.id + "-p3"} value={p.p3} onChange={this.changeGameData.bind(this, p)} /></td>
											<td className="text-center"><input type="checkbox" className="form-check-input" name={"p" + p.id + "-cb"} value={p.cb} onChange={this.changeGameData.bind(this, p)} /></td>
											<td className="text-center"><input type="checkbox" className="form-check-input" name={"p" + p.id + "-m"} value={p.m} onChange={this.changeGameData.bind(this, p)} /></td>
										</tr>
									)}
								</tbody>
							</table>
							<div className="btn btn-danger" onClick={this.resetData.bind(this)}>Reset Game</div>
						</form>
					</TabPane>
				</TabContent>
			</div>
		);
	}
}
