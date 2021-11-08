import { useState } from "react";
import millify from "millify";
import { Select, Typography, Row, Col, Avatar, Card } from 'antd';
import moment from 'moment';

import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import { useGetCryptosQuery } from '../services/cryptoApi';

import Loader from './Loader';

const { Text, Title } = Typography;
const { Option } = Select;
const defaultImage = 'https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News';

function News({ simplified }) {
    const [newsCategory, setNewsCategory] = useState('Cryptocurrency');
    const { data: cryptoNews } = useGetCryptoNewsQuery({ newsCategory, count: simplified ? 6 : 12 });
    const { data } = useGetCryptosQuery(100);

    if(!cryptoNews?.value) return <Loader />;

    return (
        <section className="news">
            <Row gutter={[24, 24]}>
                {!simplified && (
                    <Col span={24}>
                        <Select
                            showSearch
                            className="select-news"
                            placeholder="Filter by Crypto"
                            optionFilterProp="children"
                            onChange={(value) => setNewsCategory(value)}
                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLocaleLowerCase()) >= 0}
                        >
                            <Option value='Cryptocurrency'>Cryptocurrency</Option>
                            {data?.data?.coins.map((coin) => <Option value={coin.name}>{coin.name}</Option>)}
                        </Select>
                    </Col>
                )}
                {cryptoNews.value.map((news, i) => (
                    <Col xs={24} sm={12} lg={8} key={i}>
                        <Card hoverable className="news-card">
                            <a href={news.url} target="_blank" rel="noreferrer">
                                <div className="news-image-container">
                                    <Title className="news-title" level={4}>{news.name}</Title>
                                    <img src={news?.image?.thumbnail?.contentUrl || defaultImage} alt="Article Thumbnail" />
                                </div>
                                <p>
                                    {news.description > 50 ? `${news.description.substring(0, 50)}...` : news.description}
                                </p>
                                <div className="provider-container">
                                    <div className="">
                                        <Avatar src={news.provider[0]?.image?.thumbnail?.contentUrl || defaultImage} alt="news" />
                                        <Text className="provider-name">{news.provider[0]?.name}</Text>
                                    </div>
                                    <Text className="provider-date"> {moment(news.dataPublished).startOf('ss').fromNow()}</Text>
                                </div>
                            </a>
                        </Card>
                    </Col>
                ))}
            </Row>
        </section>
    )
}

export default News
