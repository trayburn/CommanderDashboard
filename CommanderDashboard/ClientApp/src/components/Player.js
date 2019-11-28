import React, { Component } from 'react';
import * as signalR from "@microsoft/signalr";

export class Player extends Component {
	static displayName = Player.name;

	constructor(props) {
		super(props);
		this.state = {
			id: 0,
			name: "Loading...",
			twitter: "Loading...",
			life: 0,
			p0: 0,
			p1: 0,
			p2: 0,
			p3: 0,
			cb: false,
			m: false,
			top: props.top,
			left: props.left,
			playerId: props.playerId
		};

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
				console.log('Connection error');
			});
	}

	init() {
		this.connection.on("updatePlayer", (player, index) => {
			if (index === this.state.playerId) {
				this.setState(player);
			}
		});

		this.connection.invoke("GetPlayer", this.state.playerId)
			.catch(err => console.error(err.toString()));
	}

	render() {
		var rowClass = "row bga-player text-white px-2";
		rowClass += this.state.left ? " rounded-right" : " rounded-left";
		return (
			<div className="container">
				<Flags state={this.state} top={false} />
				<div className={rowClass}>
					<LifeTotal state={this.state} left={true} />
					<Name state={this.state} left={true} />
					<Twitter state={this.state} />
					<Name state={this.state} left={false} />
					<LifeTotal state={this.state} left={false} />
				</div>
				<Flags state={this.state} top={true} />
			</div>
		);
	}
}

const Flags = ({ state, top }) => {
	var baseClass = "h5 mt-0 mb-0 mx-2 py-1 align-middle text-center text-white rounded-" + (top ? "bottom" : "top");
	var damageClass = " col-1 " + baseClass;
	var damageClass0 = damageClass + " bga-" + color(0) + (state.p0 === 0 ? " invisible" : " visible");
	var damageClass1 = damageClass + " bga-" + color(1) + (state.p1 === 0 ? " invisible" : " visible");
	var damageClass2 = damageClass + " bga-" + color(2) + (state.p2 === 0 ? " invisible" : " visible");
	var damageClass3 = damageClass + " bga-" + color(3) + (state.p3 === 0 ? " invisible" : " visible");
	var flagClass = "bga-primary " + baseClass;
	var blessingClass = "col-3 " + flagClass + (state.cb ? " visible" : " invisible");
	var monarchClass = "col-2 " + flagClass + (state.m ? " visible" : " invisible");

	if (state.top === top) {
		return (<div className="row">
			<div className={damageClass0}>{state.p0}</div>
			<div className={damageClass1}>{state.p1}</div>
			<div className={damageClass2}>{state.p2}</div>
			<div className={damageClass3}>{state.p3}</div>
			<div className={blessingClass}>City's Blessing</div>
			<div className={monarchClass}>Monarch</div>
		</div>);
	}
	return null;
}

const LifeTotal = ({ state, left }) => {
	var colClass = left ? "col-2 h1 text-left" : "col-2 h1 text-right";
	if (state.left === left) {
		return (
			<div className={colClass}>{state.life}</div>
		);
	}
	return null;
};


const Name = ({ state, left }) => {
	var colClass = left ? "col h1 text-left" : "col h1 text-right";
	if (state.left === left) {
		return (<div className={colClass}>{state.name}</div>);
	}
	return null;
};


const Twitter = ({ state }) => {
	var colClass = (state.left ? "col h1 twitter text-right text-" : "col h1 twitter text-left text-") + color(state.id);
	colClass += state.top ? " align-top align-text-top" : " align-bottom align-text-bottom";
	return (<div className={colClass}>{state.twitter}</div>);
};

function color(id) {
	switch (id) {
		case 0:
			return "danger";
		case 1:
			return "success";
		case 2:
			return "warning";
		case 3:
			return "primary";
		default:
			return "white";
	}
}
