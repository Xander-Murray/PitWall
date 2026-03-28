"""
Generate realistic repair shop invoice PNG images for PitWall demos.
Output: frontend/public/demo-images/invoice_*.png
Run: cd backend && python scripts/generate_demo_images.py
"""

from PIL import Image, ImageDraw, ImageFont
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "../../frontend/public/demo-images")
W, H = 850, 1100
BG = (255, 255, 255)
BLACK = (0, 0, 0)
DARK_GRAY = (80, 80, 80)
MID_GRAY = (140, 140, 140)
LIGHT_GRAY = (210, 210, 210)
RULE_COLOR = (180, 180, 180)

# Try to load a monospace font; fall back to default
def get_font(size, bold=False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeMono.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_invoice(filename, shop_name, address, phone, customer, vehicle, date, ro,
                 items, subtotal, tax_rate=0.0825, footer=""):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    font_title = get_font(22, bold=True)
    font_sub = get_font(11)
    font_bold = get_font(12, bold=True)
    font_reg = get_font(12)
    font_small = get_font(10)
    font_tiny = get_font(9)

    y = 40

    # Shop name header
    bbox = d.textbbox((0, 0), shop_name, font=font_title)
    tw = bbox[2] - bbox[0]
    d.text(((W - tw) // 2, y), shop_name, font=font_title, fill=BLACK)
    y += 32

    # Address + phone centered
    addr_line = f"{address}  |  {phone}"
    bbox = d.textbbox((0, 0), addr_line, font=font_sub)
    tw = bbox[2] - bbox[0]
    d.text(((W - tw) // 2, y), addr_line, font=font_sub, fill=DARK_GRAY)
    y += 22

    # Rule
    d.line([(50, y), (W - 50, y)], fill=RULE_COLOR, width=1)
    y += 14

    # Customer / vehicle info row
    d.text((50, y), f"Customer: {customer}", font=font_reg, fill=BLACK)
    d.text((450, y), f"Date: {date}", font=font_reg, fill=BLACK)
    y += 18
    d.text((50, y), f"Vehicle:  {vehicle}", font=font_reg, fill=BLACK)
    d.text((450, y), f"RO#:  {ro}", font=font_reg, fill=BLACK)
    y += 22

    d.line([(50, y), (W - 50, y)], fill=RULE_COLOR, width=1)
    y += 16

    # Section header
    d.text((50, y), "RECOMMENDED SERVICES", font=font_bold, fill=BLACK)
    y += 20

    # Column headers
    d.text((50, y), "Description", font=font_bold, fill=DARK_GRAY)
    d.text((660, y), "Price", font=font_bold, fill=DARK_GRAY)
    y += 16
    d.line([(50, y), (W - 50, y)], fill=LIGHT_GRAY, width=1)
    y += 10

    # Line items
    for desc, price, note in items:
        d.text((50, y), desc, font=font_reg, fill=BLACK)
        price_str = f"${price:,.2f}"
        bbox = d.textbbox((0, 0), price_str, font=font_reg)
        pw = bbox[2] - bbox[0]
        d.text((W - 50 - pw, y), price_str, font=font_reg, fill=BLACK)
        y += 16
        if note:
            d.text((68, y), note, font=font_small, fill=MID_GRAY)
            y += 14
        # Dotted separator
        for x in range(50, W - 50, 6):
            d.point((x, y + 2), fill=LIGHT_GRAY)
        y += 10

    y += 10
    d.line([(50, y), (W - 50, y)], fill=RULE_COLOR, width=1)
    y += 16

    # Totals
    tax = subtotal * tax_rate
    total = subtotal + tax

    for label, amount in [("SUBTOTAL", subtotal), (f"TAX ({tax_rate*100:.2f}%)", tax), ("TOTAL DUE", total)]:
        label_font = font_bold if label == "TOTAL DUE" else font_reg
        d.text((550, y), label, font=label_font, fill=BLACK)
        val_str = f"${amount:,.2f}"
        bbox = d.textbbox((0, 0), val_str, font=label_font)
        vw = bbox[2] - bbox[0]
        d.text((W - 50 - vw, y), val_str, font=label_font, fill=BLACK)
        y += 20

    y += 20
    d.line([(50, y), (W - 50, y)], fill=RULE_COLOR, width=1)
    y += 20

    # Footer
    if footer:
        for line in footer.split("\n"):
            bbox = d.textbbox((0, 0), line, font=font_tiny)
            tw = bbox[2] - bbox[0]
            d.text(((W - tw) // 2, y), line, font=font_tiny, fill=MID_GRAY)
            y += 14

    y += 20
    # Signature line
    d.line([(50, y + 20), (350, y + 20)], fill=DARK_GRAY, width=1)
    d.text((50, y + 26), "Authorized Signature / Advisor", font=font_tiny, fill=MID_GRAY)
    d.line([(480, y + 20), (W - 50, y + 20)], fill=DARK_GRAY, width=1)
    d.text((480, y + 26), "Customer Signature", font=font_tiny, fill=MID_GRAY)

    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, filename)
    img.save(path, "PNG")
    print(f"Saved: {path}")


# --- Invoice 1: Westside Auto Repair — mixed urgency, vague claims ---
draw_invoice(
    filename="invoice_westside.png",
    shop_name="WESTSIDE AUTO REPAIR",
    address="4821 W. Commerce Blvd, San Antonio TX 78201",
    phone="(210) 555-0147",
    customer="Maria Reyes",
    vehicle="2018 Honda Accord  |  Mileage: 61,400",
    date="03/28/2026",
    ro="RO-29841",
    items=[
        ("Front Brake Pads & Rotors",        489.00, "Brakes are dangerously worn — need immediate replacement"),
        ("Power Steering Fluid Flush",        149.00, "Fluid is dirty, recommend flush"),
        ("Cabin Air Filter",                   89.00, "Filter is clogged, affecting A/C performance"),
        ("Throttle Body Cleaning",            119.00, "Recommended due to age of vehicle"),
        ("Tire Rotation & Balance",            59.00, None),
    ],
    subtotal=905.00,
    footer="All work guaranteed for 12 months / 12,000 miles.\nDeclined services are at customer's risk.",
)

# --- Invoice 2: QuickLube Express — oil change upsell stack ---
draw_invoice(
    filename="invoice_quicklube.png",
    shop_name="QUICKLUBE EXPRESS",
    address="1902 Loop 410 Access Rd, San Antonio TX 78224",
    phone="(210) 555-0293",
    customer="Jennifer Walsh",
    vehicle="2020 Toyota RAV4  |  Mileage: 38,200",
    date="03/28/2026",
    ro="QL-11047",
    items=[
        ("Full Synthetic Oil Change (5W-30)",  79.99, "Includes filter and top-off"),
        ("Fuel System Cleaning Service",       149.99, "Highly recommended — improves MPG and performance"),
        ("Transmission Fluid Service",         249.99, "Due at 30k miles — past due per our records"),
        ("Engine Air Filter Replacement",       69.99, "Dirty filter found during inspection"),
        ("Wiper Blade Replacement (pair)",      49.99, None),
    ],
    subtotal=599.95,
    footer="Thank you for choosing QuickLube Express!\nPresent this invoice for 10% off your next visit.",
)

# --- Invoice 3: Metro Automotive — legitimate safety issue with evidence ---
draw_invoice(
    filename="invoice_metro.png",
    shop_name="METRO AUTOMOTIVE",
    address="709 N. Main Ave, San Antonio TX 78205",
    phone="(210) 555-0374",
    customer="Sandra Torres",
    vehicle="2017 Ford Escape  |  Mileage: 84,700",
    date="03/28/2026",
    ro="MA-55209",
    items=[
        ("Front Left Brake Caliper Replacement", 520.00, "Caliper seized on lift — confirmed by tech, photos on file"),
        ("Brake Fluid Flush",                     89.00, "Fluid tested dark (3.7% moisture) — at replacement threshold"),
        ("Rear Brake Inspection",                 45.00, "Rear pads at 4mm — marginal, recommend monitoring"),
        ("Serpentine Belt Inspection",            25.00, "No cracks found, belt OK at this mileage"),
    ],
    subtotal=679.00,
    footer="Inspection photos available upon request.\nAll brake work includes 24-month / 24,000-mile warranty.",
)

# --- Invoice 4: Premier Service Center — 100k bundle ---
draw_invoice(
    filename="invoice_premier.png",
    shop_name="PREMIER SERVICE CENTER",
    address="3300 Fredericksburg Rd, San Antonio TX 78201",
    phone="(210) 555-0481",
    customer="Angela Kim",
    vehicle="2016 Nissan Altima  |  Mileage: 97,500",
    date="03/28/2026",
    ro="PS-88031",
    items=[
        ("Spark Plug Replacement (4)",         289.00, "Due at 100k miles — manufacturer recommended"),
        ("Timing Chain Tensioner Inspection",  179.00, "Precautionary at high mileage — not yet failed"),
        ("Coolant System Flush",               129.00, "Recommended every 50k — last service unknown"),
        ("Power Steering Fluid Flush",         119.00, "Fluid discolored per visual check"),
        ("Differential Service (front)",       189.00, "No evidence of issue — standard interval service"),
        ("Fuel Injector Cleaning",             149.00, "Recommended to maintain fuel economy"),
    ],
    subtotal=1054.00,
    footer="100,000-mile milestone package. Items may be declined individually.\nConsult your owner's manual for manufacturer service intervals.",
)

print("All demo images generated.")
