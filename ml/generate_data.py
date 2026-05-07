import streamlit as st
import requests

# ---------------- PAGE CONFIG ----------------
st.set_page_config(
    page_title="StrategyLab AI",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------- GLOBAL STYLE ----------------
st.markdown("""
<style>
html, body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.main {
    background-color: #0f172a;
}

/* Sidebar */
section[data-testid="stSidebar"] {
    background-color: #020617;
    color: white;
}

/* Cards */
.card {
    background: #111827;
    padding: 22px;
    border-radius: 12px;
    border: 1px solid #1f2937;
}

/* Titles */
.title {
    font-size: 28px;
    font-weight: 600;
    color: white;
}

.subtitle {
    color: #9ca3af;
    font-size: 14px;
}

/* Metrics */
.metric {
    font-size: 26px;
    font-weight: 600;
    color: white;
}

.label {
    font-size: 12px;
    color: #9ca3af;
}

/* Button */
.stButton>button {
    background: #2563eb;
    color: white;
    border-radius: 8px;
    height: 45px;
    font-weight: 500;
}
</style>
""", unsafe_allow_html=True)

# ---------------- SIDEBAR ----------------
st.sidebar.title("StrategyLab AI")
page = st.sidebar.radio("", ["Dashboard", "Simulation", "Insights"])

# ---------------- DASHBOARD ----------------
if page == "Dashboard":

    st.markdown('<div class="title">Business Overview</div>', unsafe_allow_html=True)
    st.markdown('<div class="subtitle">Real-time decision intelligence</div>', unsafe_allow_html=True)

    st.markdown("")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("""
        <div class="card">
            <div class="label">Total Simulations</div>
            <div class="metric">128</div>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown("""
        <div class="card">
            <div class="label">Avg Profit</div>
            <div class="metric">₹3,75,000 / $4,500</div>
        </div>
        """, unsafe_allow_html=True)

    with col3:
        st.markdown("""
        <div class="card">
            <div class="label">Risk Rate</div>
            <div class="metric">12%</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("")
    st.info("Use Simulation to generate predictions")

# ---------------- SIMULATION ----------------
elif page == "Simulation":

    st.markdown('<div class="title">Business Simulator</div>', unsafe_allow_html=True)
    st.markdown('<div class="subtitle">Predict profit and risk instantly</div>', unsafe_allow_html=True)

    st.markdown("")

    left, right = st.columns([1,1])

    # INPUT PANEL
    with left:
        st.markdown("#### Input Parameters")

        price = st.number_input("Price", value=200)
        marketing = st.number_input("Marketing Spend", value=5000)
        customers = st.number_input("Customers", value=3000)
        discount = st.slider("Discount", 0.0, 0.5, 0.1)
        cost = st.number_input("Cost", value=10000)

        run = st.button("Run Analysis", use_container_width=True)

    # OUTPUT PANEL
    with right:
        st.markdown("#### Prediction Output")

        if run:
            try:
                res = requests.post(
                    "http://127.0.0.1:8000/predict",
                    params={
                        "price": price,
                        "marketing": marketing,
                        "customers": customers,
                        "discount": discount,
                        "cost": cost
                    }
                )

                data = res.json()
                profit = data["predicted_profit"]
                risk = data["risk"]

                # PROFIT CARD
                st.markdown(f"""
                <div class="card">
                    <div class="label">Predicted Profit</div>
                    <div class="metric">₹{profit:,.0f} / ${profit/83:,.0f}</div>
                </div>
                """, unsafe_allow_html=True)

                st.markdown("")

                # RISK
                if risk == 1:
                    st.error("High Risk Strategy")
                    st.caption("Reduce cost or discount levels")
                else:
                    st.success("Low Risk Strategy")
                    st.caption("Safe to scale operations")

            except:
                st.error("Backend not running")

# ---------------- INSIGHTS ----------------
elif page == "Insights":

    st.markdown('<div class="title">Insights</div>', unsafe_allow_html=True)
    st.markdown('<div class="subtitle">AI-driven recommendations</div>', unsafe_allow_html=True)

    st.markdown("")

    st.markdown("""
    <div class="card">
    <b>Key Observations</b><br><br>
    • High marketing increases revenue but adds risk<br>
    • Discounts above 20% hurt profitability<br>
    • Cost control gives strongest impact<br>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("")

    st.markdown("""
    <div class="card">
    <b>Strategy Recommendation</b><br><br>
    ✔ Keep discount between 5–15%<br>
    ✔ Increase marketing gradually<br>
    ✔ Optimize cost structure<br>
    </div>
    """, unsafe_allow_html=True)

# ---------------- FOOTER ----------------
st.markdown("---")
st.caption("StrategyLab AI • Enterprise SaaS Edition • 2026")