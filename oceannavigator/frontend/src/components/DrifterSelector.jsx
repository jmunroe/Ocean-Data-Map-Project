import React from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';
import ComboBox from './ComboBox.jsx';

class DrifterSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imei: [],
            wmo: [],
            deployment: [],
            imei_map: {},
            wmo_map: {},
            deployment_map: {},
        };
    }

    componentDidMount() {
        $.ajax({
            url: '/api/drifters/meta/',
            dataType: 'json',
            success: function(data) {
                this.setState({
                    imei_map: data['imei'],
                    wmo_map: data['wmo'],
                    deployment_map: data['deployment']
                });
            }.bind(this),
            error: function(r, status, err) {
                console.error('/api/drifter/meta.json', status, err.toString());
            },
        });
    }

    onUpdate(keys, values) {
        var newState = {
            imei: this.state.imei,
            wmo: this.state.wmo,
            deployment: this.state.deployment,
        }
        for (var i = 0; i < keys.length; i++) {
            newState[keys[i]] = values[i];
        }

        this.props.select(Array.from(new Set([].concat.apply([], [].concat(
            newState.imei.map(function (o) {
                return this.state.imei_map[o];
            }.bind(this)),
            newState.wmo.map(function (o) {
                return this.state.wmo_map[o];
            }.bind(this)),
            newState.deployment.map(function (o) {
                return this.state.deployment_map[o];
            }.bind(this))
        )))));
        this.setState(newState);
    }

    render() {
        var imei = Array.from(new Set(Object.keys(this.state.imei_map))).sort().map(function(o) { return { id: o, value: o, }; });
        var wmo = Array.from(new Set(Object.keys(this.state.wmo_map))).sort().map(function(o) { return { id: o, value: o, }; });
        var deployment = Array.from(new Set(Object.keys(this.state.deployment_map))).sort().map(function(o) { return { id: o, value: o, }; });
        return (
            <div className='DrifterSelector'>
                <div className='inputs'>
                    <ComboBox key='imei' id='imei' state={this.state.imei} multiple title='IMEI' data={imei} onUpdate={this.onUpdate.bind(this)} />
                    <ComboBox key='wmo' id='wmo' state={this.state.wmo} multiple title='WMO' data={wmo} onUpdate={this.onUpdate.bind(this)}/>
                    <ComboBox key='deployment' id='deployment' state={this.state.deployment} multiple title='Deployment' data={deployment} onUpdate={this.onUpdate.bind(this)} />
                </div>
            </div>
        );
    }
}

export default DrifterSelector;