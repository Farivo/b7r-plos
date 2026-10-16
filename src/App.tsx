import { useMemo, useState } from 'react'
import './App.css'

type Product = {
  id: number
  name: string
  category: string
  price: number
  oldPrice: number
  rating: number
  reviews: number
  image: string
  tag?: string
}

const products: Product[] = [
  { id: 1, name: 'مصباح الغروب الذكي', category: 'المنزل', price: 29.9, oldPrice: 49.9, rating: 4.9, reviews: 128, tag: 'الأكثر مبيعاً', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'حقيبة يومية مقاومة للماء', category: 'أسلوب الحياة', price: 44.9, oldPrice: 69.9, rating: 4.8, reviews: 96, tag: 'جديد', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'سماعات لاسلكية Pro', category: 'تقنية', price: 39.9, oldPrice: 59.9, rating: 4.7, reviews: 214, image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'كوب حراري أنيق', category: 'المنزل', price: 24.9, oldPrice: 34.9, rating: 4.9, reviews: 81, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85' },
  { id: 5, name: 'منظم مكتب خشبي', category: 'المنزل', price: 19.9, oldPrice: 29.9, rating: 4.8, reviews: 67, image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85' },
  { id: 6, name: 'ساعة رياضية ذكية', category: 'تقنية', price: 54.9, oldPrice: 79.9, rating: 4.6, reviews: 143, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85' },
]

const categories = ['الكل', 'المنزل', 'تقنية', 'أسلوب الحياة']

function App() {
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [liked, setLiked] = useState<number[]>([])
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === 'الكل' || product.category === activeCategory
    const matchesSearch = product.name.includes(search.trim()) || product.category.includes(search.trim())
    return matchesCategory && matchesSearch
  }), [activeCategory, search])

  const toggleLike = (id: number) => setLiked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  return (
    <main className="app-shell" dir="rtl">
      <div className="announcement">شحن مجاني للطلبات فوق 150 ر.س <span>استفد من العرض الآن ←</span></div>
      <nav className="nav container">
        <a className="brand" href="#top" aria-label="متجر موضي الرئيسية"><span className="brand-mark">م</span><span>متجر<span> موضي</span></span></a>
        <div className="nav-links"><a href="#shop">المتجر</a><a href="#benefits">لماذا نحن</a><a href="#story">قصتنا</a></div>
        <div className="nav-actions">
          <label className="search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث عن منتج..." aria-label="البحث عن منتج" /></label>
          <button className="icon-button" aria-label="المفضلة">♡<small>{liked.length}</small></button>
          <button className="icon-button cart" onClick={() => setCartCount((count) => count + 1)} aria-label="السلة">▢<small>{cartCount}</small></button>
        </div>
      </nav>

      <section className="hero container" id="top">
        <div className="hero-copy"><p className="eyebrow">مختاراتك اليومية، بشكل أجمل</p><h1>أشياء صغيرة<br /><em>تصنع فرقاً كبيراً.</em></h1><p className="hero-text">اكتشف منتجات مختارة بعناية تضيف لمسة ذكية وجميلة إلى يومك. جودة تستحقها، بسعر يرضيك.</p><a className="primary-button" href="#shop">تسوق الآن <span>←</span></a><div className="hero-proof"><div className="avatars"><i>س</i><i>م</i><i>ل</i><i>+</i></div><span><b>+2,000</b> عميل سعيد يثق بنا</span></div></div>
        <div className="hero-image"><img src="https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85" alt="غرفة منزلية عصرية بلمسات دافئة" /><div className="floating-note"><span>✦</span><div><b>اختيار المحررين</b><small>تفاصيل تحبها</small></div></div><div className="image-shape" /></div>
      </section>

      <section className="benefits" id="benefits"><div className="container benefit-grid"><div><strong>شحن سريع</strong><span>يصل لبابك خلال 3-5 أيام</span></div><div><strong>دفع آمن</strong><span>طرق دفع موثوقة ومشفرة</span></div><div><strong>اختيارات مميزة</strong><span>منتجات نختارها لك بعناية</span></div><div><strong>دعم حقيقي</strong><span>نحن هنا لمساعدتك دائماً</span></div></div></section>

      <section className="products-section container" id="shop"><div className="section-heading"><div><p className="eyebrow">تشكيلتنا المختارة</p><h2>الأكثر طلباً هذا الأسبوع</h2></div><a href="#shop">عرض الكل <span>←</span></a></div><div className="category-tabs" role="tablist">{categories.map((category) => <button className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)} key={category}>{category}</button>)}</div><div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={product.name} />{product.tag && <span className="product-tag">{product.tag}</span>}<button className={`heart ${liked.includes(product.id) ? 'liked' : ''}`} onClick={() => toggleLike(product.id)} aria-label={`إضافة ${product.name} للمفضلة`}>{liked.includes(product.id) ? '♥' : '♡'}</button><button className="quick-add" onClick={() => setCartCount((count) => count + 1)}>أضف للسلة +</button></div><div className="product-info"><div className="product-meta"><span>{product.category}</span><span className="rating">★ {product.rating} <small>({product.reviews})</small></span></div><h3>{product.name}</h3><div className="price"><b>{product.price.toFixed(2)} ر.س</b><del>{product.oldPrice.toFixed(2)} ر.س</del></div></div></article>)}</div></section>

      <section className="newsletter" id="story"><div className="container newsletter-inner"><div><p className="eyebrow">ابقَ على اطلاع</p><h2>أول من يعرف، أول من يحصل.</h2><p>اشترك ليصلك جديدنا وعروضنا الخاصة قبل الجميع.</p></div>{subscribed ? <div className="success-message">تم الاشتراك بنجاح. أهلاً بك في نوفا هوم.</div> : <form className="subscribe" onSubmit={(event) => { event.preventDefault(); if (email) setSubscribed(true) }}><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="بريدك الإلكتروني" aria-label="البريد الإلكتروني" /><button type="submit">اشترك الآن</button></form>}</div></section>
      <footer className="footer container"><a className="brand" href="#top"><span className="brand-mark">N</span><span>NOVA<span>HOME</span></span></a><p>منتجات جميلة لحياة أجمل.</p><span>© 2024 نوفا هوم</span></footer>
    </main>
  )
}

export default App
