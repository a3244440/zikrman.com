import { AnimatePresence, motion, Reorder } from 'motion/react'
import { useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CloseIcon, PlusIcon, UploadIcon } from '../../components/Icons'
import { categories, sizePresets } from '../../config'
import { refreshProducts } from '../../hooks/useProducts'
import { createProduct, getProductById, updateProduct, uploadImage } from '../../lib/api'
import { slugify } from '../../lib/format'
import type { ProductColor, ProductInput } from '../../lib/types'

const empty: ProductInput = {
  slug: '',
  name: '',
  category: categories[0].slug,
  price: 0,
  old_price: null,
  description: '',
  details: [],
  size_chart: '',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: [],
  images: [],
  is_new: true,
  is_featured: false,
  in_stock: true,
  sort_order: 0,
}

export default function ProductForm() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const [form, setForm] = useState<ProductInput>(empty)
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(0)
  const [error, setError] = useState('')
  const [customSize, setCustomSize] = useState('')
  const [newColor, setNewColor] = useState<ProductColor>({ name: '', hex: '#111111' })
  const [dragOver, setDragOver] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isNew) return
    getProductById(id!)
      .then((p) => {
        if (!p) {
          setError('Товар не найден')
          return
        }
        const { id: _id, created_at: _c, ...rest } = p
        setForm({ ...rest, size_chart: rest.size_chart ?? '' })
        setSlugTouched(true)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isNew])

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const onName = (name: string) =>
    setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }))

  const addFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (!list.length) return
    setUploading((n) => n + list.length)
    setError('')
    for (const file of list) {
      try {
        const url = await uploadImage(file)
        setForm((f) => ({ ...f, images: [...f.images, url] }))
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setUploading((n) => n - 1)
      }
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  const toggleSize = (s: string) =>
    set('sizes', form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Укажите название')
    if (!form.slug.trim()) return setError('Укажите адрес страницы (slug)')
    if (form.price <= 0) return setError('Укажите цену')
    if (form.images.length === 0) return setError('Добавьте хотя бы одно фото')
    setSaving(true)
    try {
      const payload: ProductInput = {
        ...form,
        name: form.name.trim(),
        slug: slugify(form.slug),
        old_price: form.old_price && form.old_price > 0 ? form.old_price : null,
        details: form.details.map((d) => d.trim()).filter(Boolean),
      }
      if (isNew) await createProduct(payload)
      else await updateProduct(id!, payload)
      await refreshProducts()
      navigate('/admin')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-muted">Загрузка…</p>

  return (
    <form onSubmit={submit} className="mx-auto max-w-5xl">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft size={16} /> Все товары
      </Link>
      <h1 className="mt-4 font-display text-4xl font-medium">{isNew ? 'Новый товар' : 'Редактирование'}</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Фото */}
          <Card title="Фотографии" hint="Первое фото — обложка. Перетаскивайте, чтобы поменять порядок.">
            <Reorder.Group
              axis="x"
              values={form.images}
              onReorder={(images) => set('images', images)}
              className="flex flex-wrap gap-3"
            >
              <AnimatePresence initial={false}>
                {form.images.map((src, i) => (
                  <Reorder.Item
                    key={src}
                    value={src}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="group relative h-36 w-28 cursor-grab overflow-hidden bg-stone active:cursor-grabbing"
                  >
                    <img src={src} alt="" className="pointer-events-none h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-ink px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-paper uppercase">
                        Обложка
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => set('images', form.images.filter((x) => x !== src))}
                      className="absolute top-1 right-1 grid h-7 w-7 place-items-center rounded-full bg-paper/90 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                      aria-label="Удалить фото"
                    >
                      <CloseIcon size={14} />
                    </button>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>

            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInput.current?.click()}
              className={`mt-4 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed px-6 py-10 text-center transition-colors ${
                dragOver ? 'border-ink bg-stone' : 'border-mist hover:border-ink'
              }`}
            >
              <UploadIcon size={28} />
              <p className="mt-3 text-sm font-medium">
                {uploading > 0 ? `Загружаем фото… (${uploading})` : 'Перетащите фото сюда или нажмите, чтобы выбрать'}
              </p>
              <p className="mt-1 text-xs text-muted">JPG, PNG, WEBP, HEIC — сожмём автоматически</p>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files)
                  e.target.value = ''
                }}
              />
            </div>
          </Card>

          {/* Основное */}
          <Card title="Основное">
            <Field label="Название">
              <input value={form.name} onChange={(e) => onName(e.target.value)} className="input" placeholder="Худи Essential" />
            </Field>
            <Field label="Адрес страницы (slug)" hint={`zikrman.com/product/${form.slug || '…'}`}>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  set('slug', e.target.value)
                }}
                className="input font-mono text-xs"
                placeholder="hudi-essential"
              />
            </Field>
            <Field label="Описание">
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={4}
                className="input resize-y"
                placeholder="Пара предложений о вещи: ткань, посадка, с чем носить."
              />
            </Field>
            <Field label="Особенности" hint="Каждая с новой строки: «100% хлопок», «Оверсайз»…">
              <textarea
                value={form.details.join('\n')}
                onChange={(e) => set('details', e.target.value.split('\n'))}
                rows={4}
                className="input resize-y"
              />
            </Field>
            <Field label="Таблица размеров" hint="Показывается во вкладке «Размер и посадка». Пустая строка — новый блок.">
              <textarea
                value={form.size_chart}
                onChange={(e) => set('size_chart', e.target.value)}
                rows={5}
                className="input resize-y font-mono text-xs"
                placeholder={'M - 48\nОбхват груди: 108 см\nДлина брюк от пояса - 100 см'}
              />
            </Field>
          </Card>

          {/* Варианты */}
          <Card title="Размеры и цвета">
            <Field label="Размеры">
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set([...sizePresets, ...form.sizes])).map((s) => {
                  const on = form.sizes.includes(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`h-9 min-w-11 border px-2.5 text-xs font-medium transition-colors ${
                        on ? 'border-ink bg-ink text-paper' : 'border-mist bg-white hover:border-ink'
                      }`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder="Свой размер, напр. 56"
                  className="input max-w-48 py-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    const s = customSize.trim()
                    if (s && !form.sizes.includes(s)) set('sizes', [...form.sizes, s])
                    setCustomSize('')
                  }}
                  className="btn-outline px-4 py-2"
                >
                  Добавить
                </button>
              </div>
            </Field>

            <Field label="Цвета">
              <div className="flex flex-wrap gap-2">
                {form.colors.map((c) => (
                  <span key={c.name} className="inline-flex items-center gap-2 border border-mist bg-white py-1.5 pr-1.5 pl-2 text-xs">
                    <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: c.hex }} />
                    {c.name}
                    <button
                      type="button"
                      onClick={() => set('colors', form.colors.filter((x) => x.name !== c.name))}
                      className="p-0.5 text-muted hover:text-ink"
                      aria-label={`Удалить цвет ${c.name}`}
                    >
                      <CloseIcon size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="color"
                  value={newColor.hex}
                  onChange={(e) => setNewColor((c) => ({ ...c, hex: e.target.value }))}
                  className="h-10 w-12 cursor-pointer border border-mist bg-white p-1"
                  aria-label="Цвет"
                />
                <input
                  value={newColor.name}
                  onChange={(e) => setNewColor((c) => ({ ...c, name: e.target.value }))}
                  placeholder="Название, напр. Графит"
                  className="input max-w-56 py-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    const name = newColor.name.trim()
                    if (!name || form.colors.some((c) => c.name === name)) return
                    set('colors', [...form.colors, { name, hex: newColor.hex }])
                    setNewColor({ name: '', hex: newColor.hex })
                  }}
                  className="btn-outline px-4 py-2"
                >
                  <PlusIcon size={14} />
                </button>
              </div>
            </Field>
          </Card>
        </div>

        {/* Боковая колонка */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card title="Цена">
            <Field label="Цена">
              <input
                type="number"
                min={0}
                value={form.price || ''}
                onChange={(e) => set('price', Number(e.target.value))}
                className="input"
                placeholder="24900"
              />
            </Field>
            <Field label="Старая цена" hint="Если заполнить — покажем скидку">
              <input
                type="number"
                min={0}
                value={form.old_price ?? ''}
                onChange={(e) => set('old_price', e.target.value ? Number(e.target.value) : null)}
                className="input"
              />
            </Field>
          </Card>

          <Card title="Публикация">
            <Field label="Категория">
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input">
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </Field>
            <Toggle checked={form.in_stock} onChange={(v) => set('in_stock', v)} label="В наличии" />
            <Toggle checked={form.is_new} onChange={(v) => set('is_new', v)} label="Новинка" />
            <Toggle checked={form.is_featured} onChange={(v) => set('is_featured', v)} label="Показывать на главной" />
            <Field label="Порядок" hint="Меньше — выше в каталоге">
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => set('sort_order', Number(e.target.value))}
                className="input"
              />
            </Field>
          </Card>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 p-3 text-sm text-sale"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button type="submit" disabled={saving || uploading > 0} className="btn-dark h-12 w-full disabled:opacity-50">
            {saving ? 'Сохраняем…' : isNew ? 'Добавить в каталог' : 'Сохранить изменения'}
          </button>
        </div>
      </div>
    </form>
  )
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="bg-paper p-5 sm:p-6">
      <h2 className="text-sm font-semibold">{title}</h2>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 text-sm">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-ink' : 'bg-mist'}`}
      >
        <motion.span
          className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </label>
  )
}
