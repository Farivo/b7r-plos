import { useEffect, useMemo, useState } from 'react'
import './App.css'

type ShopifyProduct = {
  id: string
  name: string
  category: string
  price: number
  oldPrice: number
  rating: number
  reviews: number
  image: string
  tag?: string
  variantId: string
}

const categories = ['الكل', 'المنزل', 'تقنية', 'أسلوب الحياة']
const shopDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || import.meta.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || import.meta.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

async function shopifyRequest<T>(query: string, variables = {}): Promise<T> {
  const response = await fetch(`https://${shopDomain}/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': storefrontToken },
    body: JSON.stringify({ query, variables }),
  })
  if (!response.ok) throw new Error('تعذر الاتصال بالمتجر')
  const payload = await response.json()
  if (payload.errors?.length) throw new Error(payload.errors[0].message)
  return payload.data
}

function App() {
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [cartId, setCartId] = useState<string | null>(null)
  const [liked, setLiked] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const query = `query Products { products(first: 24, sortKey: BEST_SELLING) { nodes { id title productType tags featuredImage { url altText } priceRange { minVariantPrice { amount currencyCode } } compareAtPriceRange { maxVariantPrice { amount } } variants(first: 1) { nodes { id } } } } }`
    shopifyRequest<{ products: { nodes: Array<{ id: string; title: string; productType: string; tags: string[]; featuredImage?: { url: string; altText?: string }; priceRange: { minVariantPrice: { amount: string } }; compareAtPriceRange: { maxVariantPrice: { amount: string } }; variants: { nodes: Array<{ id: string }> } }> } }>(query)
      .then((data) => setProducts(data.products.nodes.filter((product) => product.variants.nodes[0]).map((product) => ({
        id: product.id, name: product.title, category: product.productType || 'أسلوب الحياة', price: Number(product.priceRange.minVariantPrice.amount), oldPrice: Number(product.compareAtPriceRange.maxVariantPrice.amount) || Number(product.priceRange.minVariantPrice.amount), rating: 4.8, reviews: 0, image: product.featuredImage?.url || '', tag: product.tags[0], variantId: product.variants.nodes[0].id,
      }))))
      .catch(() => setError('لم نتمكن من تحميل المنتجات حالياً. يرجى المحاولة مرة أخرى.'))
      .finally(() => setLoading(false))
  }, [])

  const visibleProducts = useMemo(() => products.filter((product) => (activeCategory === 'الكل' || product.category === activeCategory) && (product.name.includes(search.trim()) || product.category.includes(search.trim()))), [activeCategory, search, products])

  const addToCart = async (variantId: string) => {
    try {
      const query = cartId ? `mutation Add($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id totalQuantity } } }` : `mutation Create($input: CartInput!) { cartCreate(input: $input) { cart { id totalQuantity checkoutUrl } } }`
      const variables = cartId ? { cartId, lines: [{ merchandiseId: variantId, quantity: 1 }] } : { input: { lines: [{ merchandiseId: variantId, quantity: 1 }] } }
      const data = await shopifyRequest<{ cartLinesAdd?: { cart: { id: string; totalQuantity: number } }; cartCreate?: { cart: { id: string; totalQuantity: number } } }>(query, variables)
      const cart = data.cartLinesAdd?.cart || data.cartCreate?.cart
      if (cart) { setCartId(cart.id); setCartCount(cart.totalQuantity) }
    } catch { setError('تعذر إضافة المنتج للسلة. حاول مرة أخرى.') }
  }

  const checkout = async () => {
    if (!cartId) return
    const data = await shopifyRequest<{ cart: { checkoutUrl: string } }>(`query Cart($id: ID!) { cart(id: $id) { checkoutUrl } }`, { id: cartId })
    window.location.href = data.cart.checkoutUrl
  }

  return (
    <main className="app-shell" dir="rtl">
      <div className="announcement">شحن مجاني للطلبات فوق 150 ر.س <span>استفد من العرض الآن ←</span></div>
      <nav className="nav container">
        <a className="brand" href="#top" aria-label="متجر موضي الرئيسية"><span className="brand-mark">م</span><span>متجر<span> موضي</span></span></a>
        <div className="nav-links"><a href="#shop">المتجر</a><a href="#benefits">لماذا نحن</a><a href="#story">قصتنا</a></div>
        <div className="nav-actions"><label className="search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث عن منتج..." aria-label="البحث عن منتج" /></label><button className="icon-button" aria-label="المفضلة">♡<small>{liked.length}</small></button><button className="icon-button cart" onClick={checkout} aria-label="السلة">▢<small>{cartCount}</small></button></div>
      </nav>
      <section className="hero container" id="top"><div className="hero-copy"><p className="eyebrow">مختاراتك اليومية، بشكل أجمل</p><h1>أشياء صغيرة<br /><em>تصنع فرقاً كبيراً.</em></h1><p className="hero-text">اكتشف منتجات مختارة بعناية تضيف لمسة ذكية وجميلة إلى يومك. جودة تستحقها، بسعر يرضيك.</p><a className="primary-button" href="#shop">تسوق الآن <span>←</span></a><div className="hero-proof"><div className="avatars"><i>س</i><i>م</i><i>ل</i><i>+</i></div><span><b>تشكيلة مختارة</b> من متجر موضي</span></div></div><div className="hero-image"><img src="https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85" alt="غرفة منزلية عصرية بلمسات دافئة" /><div className="floating-note"><span>✦</span><div><b>اختيار المحررين</b><small>تفاصيل تحبها</small></div></div><div className="image-shape" /></div></section>
      <section className="benefits" id="benefits"><div className="container benefit-grid"><div><strong>شحن سريع</strong><span>يصل لبابك خلال 3-5 أيام</span></div><div><strong>دفع آمن</strong><span>طرق دفع موثوقة ومشفرة</span></div><div><strong>اختيارات مميزة</strong><span>منتجات نختارها لك بعناية</span></div><div><strong>دعم حقيقي</strong><span>نحن هنا لمساعدتك دائماً</span></div></div></section>
      <section className="products-section container" id="shop"><div className="section-heading"><div><p className="eyebrow">تشكيلتنا المختارة</p><h2>الأكثر طلباً هذا الأسبوع</h2></div><a href="#shop">عرض الكل <span>←</span></a></div><div className="category-tabs" role="tablist">{categories.map((category) => <button className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)} key={category}>{category}</button>)}</div>{error && <p className="error-message">{error}</p>}{loading ? <p className="loading-message">نجهز لك المنتجات...</p> : <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={product.name} />{product.tag && <span className="product-tag">{product.tag}</span>}<button className={`heart ${liked.includes(product.id) ? 'liked' : ''}`} onClick={() => setLiked((current) => current.includes(product.id) ? current.filter((item) => item !== product.id) : [...current, product.id])} aria-label={`إضافة ${product.name} للمفضلة`}>{liked.includes(product.id) ? '♥' : '♡'}</button><button className="quick-add" onClick={() => addToCart(product.variantId)}>أضف للسلة +</button></div><div className="product-info"><div className="product-meta"><span>{product.category}</span><span className="rating">★ {product.rating} <small>{product.reviews ? `(${product.reviews})` : ''}</small></span></div><h3>{product.name}</h3><div className="price"><b>{product.price.toFixed(2)} ر.س</b>{product.oldPrice > product.price && <del>{product.oldPrice.toFixed(2)} ر.س</del>}</div></div></article>)}</div>}</section>
      <section className="newsletter" id="story"><div className="container newsletter-inner"><div><p className="eyebrow">ابقَ على اطلاع</p><h2>أول من يعرف، أول من يحصل.</h2><p>اشترك ليصلك جديدنا وعروضنا الخاصة قبل الجميع.</p></div>{subscribed ? <div className="success-message">تم الاشتراك بنجاح. أهلاً بك في متجر موضي.</div> : <form className="subscribe" onSubmit={(event) => { event.preventDefault(); if (email) setSubscribed(true) }}><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="بريدك الإلكتروني" aria-label="البريد الإلكتروني" /><button type="submit">اشترك الآن</button></form>}</div></section>
      <footer className="footer container"><a className="brand" href="#top"><span className="brand-mark">م</span><span>متجر<span> موضي</span></span></a><p>منتجات جميلة لحياة أجمل.</p><span>© 2026 متجر موضي</span></footer>
    </main>
  )
}

export default App
