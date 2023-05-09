import { Grid } from "@mui/material";

import ServiceCard, { ServiceCardProps } from "./ServiceCard";
import buildNowImg from "../../../assets/serviceImgs/buildNow.jpg";
import demiriImg from "../../../assets/serviceImgs/demiri.jpg";
import trtImg from "../../../assets/serviceImgs/TRT.png";
import roofing from "../../../assets/serviceImgs/roofing.png";

export default function ServiceAllCards() {
  return (
    <Grid
      container
      paddingX={1}
      paddingY={2}
      spacing={2}
      justifyContent={"center"}
      columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 8 }}
    >
      {cards?.map((card) => (
        <Grid key={card.id} item>
          <ServiceCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}

const cards = [
  {
    id: 1,
    title: "Build Now Construction",
    subtitle: "General Contracting and construction",
    img: buildNowImg,
    imgAlt: "Build Now",
    description: `Transform your home into the space of your dreams with the help of Build Now Construction. We are a general contracting and construction company that specializes in renovation and remodeling services for residential and commercial properties.`,
    moreDesc: `Our team of experienced professionals has the skills and knowledge to handle any renovation or remodeling project, big or small. From kitchen and bathroom renovations to office and retail space remodels, we've got you covered.

    At Build Now, we understand that a successful renovation project requires careful planning, attention to detail, and excellent communication. That's why we work closely with our clients to understand their unique needs and preferences, and we keep them informed every step of the way.
    
    Whether you're looking to update your home for a fresh new look, or you need to renovate your commercial property to accommodate your growing business, we can help. With our expertise in construction and renovation, you can trust that your project is in good hands.
    
    So why wait? Contact Build Now today to schedule a consultation and start turning your renovation dreams into reality. Let us help you create the perfect space for your home or business`,
  },
  {
    id: 2,
    title: "Demiri Painting & Decorating",
    subtitle: "Paint & Wallpaper Contractors",
    img: demiriImg,
    imgAlt: "demiri",
    description: `Demiri Painting & Decorating Services is a Top Rated Painting company and Home renovation company with years of experience based in Toronto, ON. We serve Toronto as well as surrounding cities including Mississauga, Brampton, Vaughan, Markham, Scarborough and more.`,
    moreDesc: `We have over 19 years experience providing quality professional residential and commercial painting services at reasonable prices. We are proud for our reputation for great quality and personal service. Our professional team always works together to ensure a smooth running of job and a high standard of workmanship. Customer satisfaction has been and remains our utmost priority, which is why we we offer a 100% satisfaction guarantee. Our knowledgeable and highly skilled professional painters are trained with minimum 10 years painting experience.

    Quality work that is completed on time and within budget, and exceed costumer's expectation, is just the beginning of what we do for our costumer's. Colour is critical when setting the tone and the mood of the home. It is important to select the right colours to ensure continuity and a flow from one area to the next. Demiri experts will work with you to create a paint colour that compliments your home and reflects your personal style.
    
    Also at Demiri Painting, we can help you with Home renovations, Condominium renovations, Bathroom renovations, Drywall repair and installation, Stucco repair and removal, Ceilings flattening, Carpentry, Floor installation and much more!
    
    Give us a chance to paint your house, and we guarantee you won't be disappointed.`,
  },
  {
    id: 3,
    title: "TRT Masonry & General Contracting",
    subtitle: "General Contractors",
    img: trtImg,
    imgAlt: "TRT",
    description: `Welcome to TRT Contracting. We are an industry leading masonry and general contracting company servicing the GTA with over 30+ years of building experience. As a one stop shop for all your contracting needs you are guaranteed to end up with a space you love without all the hassle. Call us at 416-522-3453 or email us at info@trtcontracting.ca for more information. We're excited to help turn your dream project into a reality!`,
  },
  {
    id: 10,
    title: "Luc's Roofing Ltd",
    subtitle: "Roofing | 68 Church St. Toronto ON M9N 1N3",
    img: roofing,
    imgAlt: "roofing",
    description: `Established in 1976, Luc's Roofing is a family owned roofing business that has been servicing the GTA for over 40 years.
    We offer shingle roofing and flat roofing services, plus low-slope, cedar and slate roofing.`,
    moreDesc: `Our goal is to ensure each and every customer has the security of a job well done.
    That's why we stress superior products, superior workmanship and superior service.
    
    Our motto, "We've got your peace of mind covered," guides all our activities and we work hard to live up to it!
    
    Please visit our website at www.lucsroofing.com
    416-222-2672
    
    We are following all provincial guidelines for Covid-19.`,
  },
  {
    id: 4,
    title: "Build Now Construction",
    subtitle: "General Contracting and construction",
    img: buildNowImg,
    imgAlt: "img alt temp",
    description: `Transform your home into the space of your dreams with the help of Build Now Construction. We are a general contracting and construction company that specializes in renovation and remodeling services for residential and commercial properties.`,
    moreDesc: `Our team of experienced professionals has the skills and knowledge to handle any renovation or remodeling project, big or small. From kitchen and bathroom renovations to office and retail space remodels, we've got you covered.

    At Build Now, we understand that a successful renovation project requires careful planning, attention to detail, and excellent communication. That's why we work closely with our clients to understand their unique needs and preferences, and we keep them informed every step of the way.
    
    Whether you're looking to update your home for a fresh new look, or you need to renovate your commercial property to accommodate your growing business, we can help. With our expertise in construction and renovation, you can trust that your project is in good hands.
    
    So why wait? Contact Build Now today to schedule a consultation and start turning your renovation dreams into reality. Let us help you create the perfect space for your home or business`,
  },
  {
    id: 5,
    title: "Demiri Painting & Decorating",
    subtitle: "Paint & Wallpaper Contractors",
    img: demiriImg,
    imgAlt: "img alt temp",
    description: `Demiri Painting & Decorating Services is a Top Rated Painting company and Home renovation company with years of experience based in Toronto, ON. We serve Toronto as well as surrounding cities including Mississauga, Brampton, Vaughan, Markham, Scarborough and more.`,
    moreDesc: `We have over 19 years experience providing quality professional residential and commercial painting services at reasonable prices. We are proud for our reputation for great quality and personal service. Our professional team always works together to ensure a smooth running of job and a high standard of workmanship. Customer satisfaction has been and remains our utmost priority, which is why we we offer a 100% satisfaction guarantee. Our knowledgeable and highly skilled professional painters are trained with minimum 10 years painting experience.

    Quality work that is completed on time and within budget, and exceed costumer's expectation, is just the beginning of what we do for our costumer's. Colour is critical when setting the tone and the mood of the home. It is important to select the right colours to ensure continuity and a flow from one area to the next. Demiri experts will work with you to create a paint colour that compliments your home and reflects your personal style.
    
    Also at Demiri Painting, we can help you with Home renovations, Condominium renovations, Bathroom renovations, Drywall repair and installation, Stucco repair and removal, Ceilings flattening, Carpentry, Floor installation and much more!
    
    Give us a chance to paint your house, and we guarantee you won't be disappointed.`,
  },
  {
    id: 6,
    title: "TRT Masonry & General Contracting",
    subtitle: "General Contractors",
    img: trtImg,
    imgAlt: "img alt temp",
    description: `Welcome to TRT Contracting. We are an industry leading masonry and general contracting company servicing the GTA with over 30+ years of building experience. As a one stop shop for all your contracting needs you are guaranteed to end up with a space you love without all the hassle. Call us at 416-522-3453 or email us at info@trtcontracting.ca for more information. We're excited to help turn your dream project into a reality!`,
  },
  {
    id: 7,
    title: "Build Now Construction",
    subtitle: "General Contracting and construction",
    img: buildNowImg,
    imgAlt: "img alt temp",
    description: `Transform your home into the space of your dreams with the help of Build Now Construction. We are a general contracting and construction company that specializes in renovation and remodeling services for residential and commercial properties.`,
    moreDesc: `Our team of experienced professionals has the skills and knowledge to handle any renovation or remodeling project, big or small. From kitchen and bathroom renovations to office and retail space remodels, we've got you covered.

    At Build Now, we understand that a successful renovation project requires careful planning, attention to detail, and excellent communication. That's why we work closely with our clients to understand their unique needs and preferences, and we keep them informed every step of the way.
    
    Whether you're looking to update your home for a fresh new look, or you need to renovate your commercial property to accommodate your growing business, we can help. With our expertise in construction and renovation, you can trust that your project is in good hands.
    
    So why wait? Contact Build Now today to schedule a consultation and start turning your renovation dreams into reality. Let us help you create the perfect space for your home or business`,
  },
  {
    id: 8,
    title: "Demiri Painting & Decorating",
    subtitle: "Paint & Wallpaper Contractors",
    img: demiriImg,
    imgAlt: "img alt temp",
    description: `Demiri Painting & Decorating Services is a Top Rated Painting company and Home renovation company with years of experience based in Toronto, ON. We serve Toronto as well as surrounding cities including Mississauga, Brampton, Vaughan, Markham, Scarborough and more.`,
    moreDesc: `We have over 19 years experience providing quality professional residential and commercial painting services at reasonable prices. We are proud for our reputation for great quality and personal service. Our professional team always works together to ensure a smooth running of job and a high standard of workmanship. Customer satisfaction has been and remains our utmost priority, which is why we we offer a 100% satisfaction guarantee. Our knowledgeable and highly skilled professional painters are trained with minimum 10 years painting experience.

    Quality work that is completed on time and within budget, and exceed costumer's expectation, is just the beginning of what we do for our costumer's. Colour is critical when setting the tone and the mood of the home. It is important to select the right colours to ensure continuity and a flow from one area to the next. Demiri experts will work with you to create a paint colour that compliments your home and reflects your personal style.
    
    Also at Demiri Painting, we can help you with Home renovations, Condominium renovations, Bathroom renovations, Drywall repair and installation, Stucco repair and removal, Ceilings flattening, Carpentry, Floor installation and much more!
    
    Give us a chance to paint your house, and we guarantee you won't be disappointed.`,
  },
  {
    id: 9,
    title: "TRT Masonry & General Contracting",
    subtitle: "General Contractors",
    img: trtImg,
    imgAlt: "img alt temp",
    description: `Welcome to TRT Contracting. We are an industry leading masonry and general contracting company servicing the GTA with over 30+ years of building experience. As a one stop shop for all your contracting needs you are guaranteed to end up with a space you love without all the hassle. Call us at 416-522-3453 or email us at info@trtcontracting.ca for more information. We're excited to help turn your dream project into a reality!`,
  },
  {
    id: 11,
    title: "Luc's Roofing Ltd",
    subtitle: "Roofing | 68 Church St. Toronto ON M9N 1N3",
    img: roofing,
    imgAlt: "roofing",
    description: `Established in 1976, Luc's Roofing is a family owned roofing business that has been servicing the GTA for over 40 years.
    We offer shingle roofing and flat roofing services, plus low-slope, cedar and slate roofing.`,
    moreDesc: `Our goal is to ensure each and every customer has the security of a job well done.
    That's why we stress superior products, superior workmanship and superior service.
    
    Our motto, "We've got your peace of mind covered," guides all our activities and we work hard to live up to it!
    
    Please visit our website at www.lucsroofing.com
    416-222-2672
    
    We are following all provincial guidelines for Covid-19.`,
  },
] as ServiceCardProps[];
