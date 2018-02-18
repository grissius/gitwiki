import React from 'react'
import fetch from 'isomorphic-fetch';
import Link from 'next/link';

export default class extends React.Component {
  static async getInitialProps({ req }) {
    let uri = `/api/v1/repo/${req.params.name}/${req.params.ref}/${req.params.path}`;
    if (req) {
      uri = `${req.protocol}://${req.get('host')}${uri}`;
    }
    console.log(uri);
    const res = await fetch(uri, {
      method: 'GET',
    });
    const response = await res.text();
    return { repo: {...req.params}, entry: JSON.parse(response) }
  }

  render() {
    console.log([this.props.repo.name, this.props.repo.ref, this.props.repo.path]);
    const link = item => '/repo/' + [this.props.repo.name, this.props.repo.ref, this.props.repo.path, item.name].filter(p => p !== '').join('/');
    return (
      <div>
        <h1>{this.props.repo.name} <small>※ {this.props.repo.ref}</small></h1>
        <h2>🌲 {this.props.repo.path}</h2>
        {
          this.props.entry.map((item,i) => <li key={i}><Link href={link(item)}>{item.name}</Link></li>)
        }
      </div>
    )
  }
}