"use client";

import Link from "next/link";
import "./page.scss";
import CountUp from "react-countup";
import { getTestimonials } from "./(api)/homepageApis";
import { useEffect, useState } from "react";
import { getContacts } from "./(api)/contactAPi";

function Card(props) {
  return (
    <Link href={props.link} className={`card ${props.className}`}>
      <div className="top">
        <h3>{props.title}</h3>
      </div>
      <div className="bottom">
        <h1>
          <span>{props.number}</span>
          {props.desc}
        </h1>
      </div>
    </Link>
  );
}

export default function Home() {
  const [stats, setStats] = useState({
    testimonials: 0,
    contacts: 0,
  });

  // const [helper, setHelper] = useState([]);

  useEffect(() => {
    getTestimonials().then((data) => {
      setStats((prevStats) => ({
        ...prevStats,
        testimonials: data?.length,
      }));
    });
    getContacts().then((data) => {
      setStats((prevStats) => ({
        ...prevStats,
        contacts: data?.length,
      }));
    });
  }, []);

  return (
    <div className="parent dashboard">
      <div className="dashboard-container container">
        <div className="header">
          <div className="title">
            <div className="back"></div>
            <h2>Dashboard </h2>
          </div>
          <div className="btns"></div>
        </div>

        <div className="bento-wrapper">
          <div className="bento">
            <Card
              link="/activity"
              className="card1"
              title="Activity"
              number={<CountUp end={6} duration={2} />}
              desc="Activities"
            />
            {/* <Card 
              link="/addPromotionalActivities"
              className="card1"
              title="Add Promotional Activities"
              number={<CountUp end={6} duration={2} />}
              desc="Promotional Activities"
            /> */}
            <Card link="/about" className="card2" title="About Page" />
            <Card
              link="/testimonials"
              className="card3"
              title="Testimonials"
              number={<CountUp end={stats.testimonials} duration={2} />}
              desc="Testimonials"
            />
            <Card link="/hero" className="card4" title="Hero Section" />
            <Card
              link="/faq"
              className="card5"
              title="FAQ"
              number={<CountUp end={16} duration={2} />}
              desc="FAQs"
            />
            <Card
              link="/contacts"
              className="card6"
              title="Contacts"
              number={<CountUp end={stats.contacts} duration={2} />}
              desc="Contacts"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
