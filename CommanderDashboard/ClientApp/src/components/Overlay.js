import React, { Component } from 'react';
import { Player } from './Player';

export class Overlay extends Component {
	static displayName = Overlay.name;

	constructor(props) {
		super(props);
		this.state = {
			preview: "https://img.scryfall.com/cards/large/front/6/f/6fad8ca2-032d-40ee-b3d6-29ab2b59ba86.jpg?1574709925",
			rotate: false,
		};
		//		this.state.preview = "https://img.scryfall.com/cards/large/front/d/c/dc91f536-b3e5-48d2-a306-003e1bdfe8ba.jpg?1547432638";
		//		this.state.rotate = true;
	}


	render() {
		var imgClass = "";
		imgClass += this.state.rotate ? "rotate" : "preview";
		return (
			<div className="box">
				<div className="mh-100 h-100">
					<div className="row align-items-start mh-25 h-25">
						<div className="col-5"><Player playerId={0} top={true} left={true} /></div>
						<div className="col h3 text-center bga-primary rounded-bottom text-white mx-4"><strong>Future Stream Name Goes Here</strong></div>
						<div className="col-5"><Player playerId={1} top={true} left={false}  /></div>
					</div>
					<div className="row align-items-center mh-50 h-50">
						<div className="col text-left"></div>
						<div className="col text-center"><img className={imgClass} src={this.state.preview} alt="Preview Card" /></div>
						<div className="col text-right"></div>
					</div>
					<div className="row align-items-end mh-25 h-25">
						<div className="col-5"><Player playerId={2} top={false} left={true} /></div>
						<div className="col text-center"></div>
						<div className="col-5"><Player playerId={3} top={false} left={false} /></div>
					</div>
				</div>
			</div>
		);
	}
}
