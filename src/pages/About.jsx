import React from 'react'
import Layout from '../components/layout/Layout'
import '../styles/About.css'

const milestones = [
  { year: '2018', title: 'Khởi đầu', desc: 'Mở cơ sở cá tươi đầu tiên tại TP.HCM với 5 bể cá lớn.' },
  { year: '2020', title: 'Mở rộng', desc: 'Thiết lập chuỗi cung ứng lạnh, phục vụ 8 tỉnh lân cận.' },
  { year: '2023', title: 'Chuyển đổi số', desc: 'Ra mắt hệ thống Metrohcmc với ứng dụng đặt hàng trực tuyến.' },
]

const values = [
  { icon: '💧', title: 'Tươi 100%', desc: 'Nguồn cá được vận chuyển trong vòng 12h, đảm bảo giữ lạnh liên tục.' },
  { icon: '🧊', title: 'Chuỗi lạnh khép kín', desc: 'Kho lạnh tự động giúp duy trì nhiệt độ lý tưởng cho từng loại cá.' },
  { icon: '🔍', title: 'Truy xuất nguồn gốc', desc: 'Mỗi lô hàng có QR code giúp khách kiểm tra thông tin nuôi trồng.' },
]

const team = [
  { name: 'Trần Đức Hiệu', role: 'Founder & CEO', quote: 'Mang cá tươi đến mọi căn bếp Việt.' },
  { name: 'Trần Mạnh Phú', role: 'Head of Supply Chain', quote: 'Chúng tôi kiểm soát từng km vận chuyển.' },
  { name: 'Nguyễn Quốc Anh Khoa', role: 'Customer Success Lead', quote: 'Khách hàng hài lòng là kim chỉ nam.' },
]

const About = () => {
  return (
    <Layout>
      <div className="about-page">
        <section className="about-hero">
          <div>
            <p className="eyebrow">Về Fish App</p>
            <h1>Câu chuyện mang cá tươi từ biển đến bàn ăn của bạn</h1>
            <p>
              Chúng tôi xây dựng hệ thống phân phối cá tươi minh bạch, ứng dụng công nghệ để khách hàng
              đặt hàng mọi lúc và nhận hàng trong ngày.
            </p>
          </div>
          <div className="about-stat-grid">
            <div>
              <span>120+</span>
              <p>Đối tác nuôi trồng</p>
            </div>
            <div>
              <span>24h</span>
              <p>Thời gian giao tối đa</p>
            </div>
            <div>
              <span>4/5</span>
              <p>Đánh giá khách hàng</p>
            </div>
          </div>
        </section>

        <section className="values-section">
          {values.map((value) => (
            <article key={value.title} className="value-card">
              <span className="value-icon">{value.icon}</span>
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </article>
          ))}
        </section>

        <section className="milestone-section">
          <h2>Dấu mốc phát triển</h2>
          <div className="timeline">
            {milestones.map((item) => (
              <div key={item.year} className="timeline-item">
                <span className="timeline-year">{item.year}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Tại Sao Chọn Chúng Tôi?</h2>
            <div className="features-grid">
              <div className="feature-card interactive">
                <div className="feature-icon">🚚</div>
                <h3>Giao Hàng Nhanh</h3>
                <p>Giao hàng tận nơi trong vòng 2 giờ, đảm bảo cá tươi sống</p>
              </div>
              <div className="feature-card interactive">
                <div className="feature-icon">✅</div>
                <h3>Chất Lượng Đảm Bảo</h3>
                <p>100% cá tươi sống, có giấy chứng nhận vệ sinh an toàn thực phẩm</p>
              </div>
              <div className="feature-card interactive">
                <div className="feature-icon">💰</div>
                <h3>Giá Cả Hợp Lý</h3>
                <p>Giá cả cạnh tranh, nhiều ưu đãi cho khách hàng thân thiết</p>
              </div>
              <div className="feature-card interactive">
                <div className="feature-icon">🎯</div>
                <h3>Đa Dạng Sản Phẩm</h3>
                <p>Hơn 50 loại cá tươi sống, đáp ứng mọi nhu cầu của bạn</p>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Đội ngũ dẫn dắt</h2>
          <div className="team-grid">
            {team.map((member) => (
              <div key={member.name} className="team-card">
                <div className="avatar-placeholder">{member.name.charAt(0)}</div>
                <h4>{member.name}</h4>
                <p className="role">{member.role}</p>
                <p className="quote">“{member.quote}”</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default About


