import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { splitEvery } from 'ramda';
import IndexEntry, { entryType } from './IndexEntry';
import PersonalTokenContainer from '../../containers/user/PersonalTokenContainer';

export default class Index extends React.PureComponent {
  static propTypes = {
    fetchIndex: PropTypes.func.isRequired,
    index: PropTypes.arrayOf(entryType).isRequired,
  }
  componentDidMount() {
    this.props.fetchIndex();
  }

  render() {
    return (
      <div>
        {splitEvery(3, this.props.index)
          .map(tuple => (
            <Row gutter={16} style={{ marginBottom: 16 }}>
              {
                tuple.map(item => (
                  <Col span={8} key={item.name}>
                    <IndexEntry entry={item} />
                  </Col>
                ))
              }
            </Row>
          )) }
        <PersonalTokenContainer />
      </div>
    );
  }
}
