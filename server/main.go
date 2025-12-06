package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"
)

// Types
type PricePoint struct {
	Date  string  `json:"date"`
	Price float64 `json:"price"`
}

type Product struct {
	ID               string       `json:"_id"`
	Marketplace      string       `json:"marketplace"`
	Title            string       `json:"title"`
	ImageURL         string       `json:"imageUrl"`
	Price            float64      `json:"price"`
	Currency         string       `json:"currency"`
	Rating           float64      `json:"rating"`
	RatingCount      int          `json:"ratingCount"`
	ShippingEstimate string       `json:"shippingEstimate"`
	Condition        string       `json:"condition"`
	ShipsTo          []string     `json:"shipsTo"`
	ProductURL       string       `json:"productUrl,omitempty"`
	Description      string       `json:"description,omitempty"`
	Category         string       `json:"category"`
	PriceHistory     []PricePoint `json:"priceHistory"`
}

type User struct {
	ID              string            `json:"_id"`
	Email           string            `json:"email"`
	DisplayName     string            `json:"displayName"`
	DefaultCountry  string            `json:"defaultCountry"`
	DefaultCurrency string            `json:"defaultCurrency"`
	Preferences     map[string]string `json:"preferences,omitempty"`
	Favorites       []string          `json:"favorites"`
}

type LoginRequest struct {
	Email string `json:"email"`
}

type LoginResponse struct {
	User  User   `json:"user"`
	Token string `json:"token"`
}

type BatchRequest struct {
	IDs []string `json:"ids"`
}

type FavoriteRequest struct {
	UserID    string `json:"userId"`
	ProductID string `json:"productId"`
}

// Mock Data Store
var mockProducts []Product
var mockUser = User{
	ID:              "user_1",
	Email:           "guest@example.com",
	DisplayName:     "Guest User",
	DefaultCountry:  "US",
	DefaultCurrency: "USD",
	Favorites:       []string{},
}

func init() {
	// Note: rand.Seed is no longer needed in Go 1.20+
	// The global random number generator is automatically seeded
	mockProducts = generateMockProducts()
}

func generatePriceHistory(basePrice float64) []PricePoint {
	history := make([]PricePoint, 7)
	for i := 0; i < 7; i++ {
		d := time.Now().AddDate(0, 0, -(6 - i))
		variation := 0.9 + rand.Float64()*0.2 // +/- 10%
		price := basePrice * variation
		if i == 6 {
			price = basePrice // Current price on last day
		}
		history[i] = PricePoint{
			Date:  d.Format("2006-01-02"),
			Price: price,
		}
	}
	return history
}

func generateMockProducts() []Product {
	products := []Product{
		// Electronics - Amazon
		{
			ID:               "amz_1",
			Marketplace:      "AMAZON",
			Title:            "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
			ImageURL:         "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
			Price:            348.00,
			Currency:         "USD",
			Rating:           4.7,
			RatingCount:      15234,
			ShippingEstimate: "Dec 8-10",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "Industry-leading noise cancellation with Auto NC Optimizer. Crystal-clear hands-free calling with 8 microphones. Up to 30 hours of battery life.",
			Category:         "Electronics",
		},
		{
			ID:               "amz_2",
			Marketplace:      "AMAZON",
			Title:            "Apple AirPods Pro (2nd Generation) with MagSafe Case",
			ImageURL:         "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop",
			Price:            249.00,
			Currency:         "USD",
			Rating:           4.8,
			RatingCount:      45678,
			ShippingEstimate: "Dec 7-9",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "Active Noise Cancellation reduces unwanted background noise. Adaptive Transparency lets outside sounds in while reducing loud environmental noise.",
			Category:         "Electronics",
		},
		{
			ID:               "amz_3",
			Marketplace:      "AMAZON",
			Title:            "Samsung 65\" Class OLED 4K S95D Smart TV",
			ImageURL:         "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
			Price:            1997.99,
			Currency:         "USD",
			Rating:           4.6,
			RatingCount:      2341,
			ShippingEstimate: "Dec 12-15",
			Condition:        "new",
			ShipsTo:          []string{"US"},
			Description:      "OLED HDR+ with Anti-Glare. Dolby Atmos and Object Tracking Sound. Smart Hub with built-in voice assistants.",
			Category:         "Electronics",
		},
		{
			ID:               "amz_4",
			Marketplace:      "AMAZON",
			Title:            "Logitech MX Master 3S Wireless Mouse - Graphite",
			ImageURL:         "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
			Price:            99.99,
			Currency:         "USD",
			Rating:           4.8,
			RatingCount:      8765,
			ShippingEstimate: "Dec 7-8",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "8K DPI sensor. Quiet clicks. MagSpeed electromagnetic scrolling. USB-C quick charging.",
			Category:         "Computers",
		},
		{
			ID:               "amz_5",
			Marketplace:      "AMAZON",
			Title:            "Kindle Paperwhite Signature Edition - 32GB",
			ImageURL:         "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=400&h=400&fit=crop",
			Price:            189.99,
			Currency:         "USD",
			Rating:           4.7,
			RatingCount:      12456,
			ShippingEstimate: "Dec 8-10",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "6.8\" display with adjustable warm light. Wireless charging compatible. Up to 10 weeks of battery life.",
			Category:         "Electronics",
		},
		// Electronics - eBay
		{
			ID:               "ebay_1",
			Marketplace:      "EBAY",
			Title:            "Bose QuietComfort Ultra Wireless Headphones",
			ImageURL:         "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop",
			Price:            329.00,
			Currency:         "USD",
			Rating:           4.6,
			RatingCount:      3421,
			ShippingEstimate: "Dec 9-12",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA"},
			Description:      "World-class noise cancellation. Immersive Audio with Bose Immersive Audio. Up to 24 hours of battery.",
			Category:         "Electronics",
		},
		{
			ID:               "ebay_2",
			Marketplace:      "EBAY",
			Title:            "JBL Charge 5 Portable Bluetooth Speaker - Black",
			ImageURL:         "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
			Price:            139.95,
			Currency:         "USD",
			Rating:           4.7,
			RatingCount:      5678,
			ShippingEstimate: "Dec 8-11",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "Bold JBL Original Pro Sound. IP67 waterproof and dustproof. 20 hours of playtime.",
			Category:         "Electronics",
		},
		{
			ID:               "ebay_3",
			Marketplace:      "EBAY",
			Title:            "DJI Mini 3 Pro Drone with RC Controller",
			ImageURL:         "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
			Price:            759.00,
			Currency:         "USD",
			Rating:           4.5,
			RatingCount:      1234,
			ShippingEstimate: "Dec 10-14",
			Condition:        "new",
			ShipsTo:          []string{"US"},
			Description:      "Under 249g. 4K/60fps HDR Video. 48MP photos. Tri-directional obstacle sensing.",
			Category:         "Electronics",
		},
		// Computers
		{
			ID:               "amz_6",
			Marketplace:      "AMAZON",
			Title:            "Apple MacBook Air 15\" M3 Chip - Space Gray",
			ImageURL:         "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
			Price:            1299.00,
			Currency:         "USD",
			Rating:           4.9,
			RatingCount:      8932,
			ShippingEstimate: "Dec 7-9",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "15.3-inch Liquid Retina display. M3 chip with 8-core CPU and 10-core GPU. 18-hour battery life.",
			Category:         "Computers",
		},
		{
			ID:               "amz_7",
			Marketplace:      "AMAZON",
			Title:            "Mechanical Gaming Keyboard RGB Backlit - TKL",
			ImageURL:         "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop",
			Price:            79.99,
			Currency:         "USD",
			Rating:           4.4,
			RatingCount:      6543,
			ShippingEstimate: "Dec 8-10",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "Hot-swappable switches. Per-key RGB lighting. Aluminum frame. Programmable macros.",
			Category:         "Computers",
		},
		{
			ID:               "ebay_4",
			Marketplace:      "EBAY",
			Title:            "ASUS ROG Strix 27\" Gaming Monitor 165Hz",
			ImageURL:         "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
			Price:            299.99,
			Currency:         "USD",
			Rating:           4.6,
			RatingCount:      2345,
			ShippingEstimate: "Dec 9-12",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA"},
			Description:      "27\" WQHD IPS panel. 165Hz refresh rate. 1ms response time. G-SYNC compatible.",
			Category:         "Computers",
		},
		// Toys
		{
			ID:               "amz_8",
			Marketplace:      "AMAZON",
			Title:            "LEGO Star Wars Millennium Falcon Ultimate Collector",
			ImageURL:         "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?w=400&h=400&fit=crop",
			Price:            849.99,
			Currency:         "USD",
			Rating:           4.9,
			RatingCount:      4532,
			ShippingEstimate: "Dec 10-14",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "7,541 pieces. Includes 4 minifigures. Measures 33\" long and 22\" wide.",
			Category:         "Toys",
		},
		{
			ID:               "ebay_5",
			Marketplace:      "EBAY",
			Title:            "Nintendo Switch OLED Model - White",
			ImageURL:         "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
			Price:            349.00,
			Currency:         "USD",
			Rating:           4.8,
			RatingCount:      9876,
			ShippingEstimate: "Dec 8-10",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "7-inch OLED screen. Wide adjustable stand. 64GB internal storage. Enhanced audio.",
			Category:         "Toys",
		},
		// Books
		{
			ID:               "amz_9",
			Marketplace:      "AMAZON",
			Title:            "Atomic Habits by James Clear - Hardcover",
			ImageURL:         "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
			Price:            19.99,
			Currency:         "USD",
			Rating:           4.8,
			RatingCount:      125678,
			ShippingEstimate: "Dec 7-8",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "An Easy & Proven Way to Build Good Habits & Break Bad Ones. #1 New York Times bestseller.",
			Category:         "Books",
		},
		{
			ID:               "ebay_6",
			Marketplace:      "EBAY",
			Title:            "The Psychology of Money - Morgan Housel",
			ImageURL:         "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
			Price:            14.99,
			Currency:         "USD",
			Rating:           4.7,
			RatingCount:      45678,
			ShippingEstimate: "Dec 8-11",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "Timeless lessons on wealth, greed, and happiness. International bestseller.",
			Category:         "Books",
		},
		// Home
		{
			ID:               "amz_10",
			Marketplace:      "AMAZON",
			Title:            "Dyson V15 Detect Cordless Vacuum Cleaner",
			ImageURL:         "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
			Price:            749.99,
			Currency:         "USD",
			Rating:           4.6,
			RatingCount:      7654,
			ShippingEstimate: "Dec 9-12",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA"},
			Description:      "Laser reveals microscopic dust. Piezo sensor measures particles. Up to 60 min runtime.",
			Category:         "Home",
		},
		{
			ID:               "ebay_7",
			Marketplace:      "EBAY",
			Title:            "Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker",
			ImageURL:         "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
			Price:            89.95,
			Currency:         "USD",
			Rating:           4.7,
			RatingCount:      34567,
			ShippingEstimate: "Dec 8-10",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "9 appliances in 1. Whisper-quiet steam release. 6 quart capacity.",
			Category:         "Home",
		},
		// Used items
		{
			ID:               "ebay_8",
			Marketplace:      "EBAY",
			Title:            "Apple iPad Pro 12.9\" (2022) - 256GB WiFi",
			ImageURL:         "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
			Price:            899.00,
			Currency:         "USD",
			Rating:           4.5,
			RatingCount:      234,
			ShippingEstimate: "Dec 9-11",
			Condition:        "used",
			ShipsTo:          []string{"US"},
			Description:      "Like new condition. M2 chip. Liquid Retina XDR display. Original box included.",
			Category:         "Computers",
		},
		{
			ID:               "ebay_9",
			Marketplace:      "EBAY",
			Title:            "Canon EOS R6 Mirrorless Camera - Body Only",
			ImageURL:         "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
			Price:            1599.00,
			Currency:         "USD",
			Rating:           4.4,
			RatingCount:      456,
			ShippingEstimate: "Dec 10-13",
			Condition:        "used",
			ShipsTo:          []string{"US", "CA"},
			Description:      "Excellent condition. 20.1MP Full-Frame CMOS Sensor. 4K60 10-Bit Video. Low shutter count.",
			Category:         "Electronics",
		},
		// More Electronics
		{
			ID:               "amz_11",
			Marketplace:      "AMAZON",
			Title:            "Google Pixel 8 Pro 128GB - Obsidian",
			ImageURL:         "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
			Price:            799.00,
			Currency:         "USD",
			Rating:           4.6,
			RatingCount:      12345,
			ShippingEstimate: "Dec 7-9",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "6.7-inch Super Actua display. Google Tensor G3 chip. 50MP camera with Pro controls. 7 years of security updates.",
			Category:         "Electronics",
		},
		{
			ID:               "ebay_10",
			Marketplace:      "EBAY",
			Title:            "Samsung Galaxy Watch 6 Classic 47mm - Black",
			ImageURL:         "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
			Price:            349.99,
			Currency:         "USD",
			Rating:           4.5,
			RatingCount:      5678,
			ShippingEstimate: "Dec 8-11",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "Rotating bezel. Advanced health monitoring. 40-hour battery life. Sapphire crystal display.",
			Category:         "Electronics",
		},
		// More Computers
		{
			ID:               "amz_12",
			Marketplace:      "AMAZON",
			Title:            "Dell XPS 13 Plus Laptop - Intel i7, 16GB RAM, 512GB SSD",
			ImageURL:         "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
			Price:            1299.99,
			Currency:         "USD",
			Rating:           4.7,
			RatingCount:      3456,
			ShippingEstimate: "Dec 8-10",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "13.4-inch OLED touch display. 12th Gen Intel Core i7. InfinityEdge design. Premium build quality.",
			Category:         "Computers",
		},
		{
			ID:               "ebay_11",
			Marketplace:      "EBAY",
			Title:            "Razer DeathAdder V3 Pro Wireless Gaming Mouse",
			ImageURL:         "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
			Price:            149.99,
			Currency:         "USD",
			Rating:           4.8,
			RatingCount:      8901,
			ShippingEstimate: "Dec 7-9",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "30K DPI Focus Pro sensor. 90-hour battery. HyperSpeed wireless. 8 programmable buttons.",
			Category:         "Computers",
		},
		// More Toys & Games
		{
			ID:               "amz_13",
			Marketplace:      "AMAZON",
			Title:            "PlayStation 5 Console - Disc Edition",
			ImageURL:         "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
			Price:            499.99,
			Currency:         "USD",
			Rating:           4.9,
			RatingCount:      45678,
			ShippingEstimate: "Dec 9-12",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA"},
			Description:      "Ultra-high speed SSD. Ray tracing. 4K gaming. Haptic feedback. Adaptive triggers.",
			Category:         "Toys",
		},
		{
			ID:               "ebay_12",
			Marketplace:      "EBAY",
			Title:            "Xbox Series X Console - 1TB",
			ImageURL:         "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
			Price:            449.99,
			Currency:         "USD",
			Rating:           4.8,
			RatingCount:      32109,
			ShippingEstimate: "Dec 8-11",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "12 Teraflops of processing power. 4K gaming at 60fps. Quick Resume. Backward compatible.",
			Category:         "Toys",
		},
		{
			ID:               "amz_14",
			Marketplace:      "AMAZON",
			Title:            "Meta Quest 3 128GB VR Headset",
			ImageURL:         "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop",
			Price:            499.99,
			Currency:         "USD",
			Rating:           4.6,
			RatingCount:      8901,
			ShippingEstimate: "Dec 10-13",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA"},
			Description:      "Mixed reality passthrough. Snapdragon XR2 Gen 2. 128GB storage. Touch Plus controllers included.",
			Category:         "Toys",
		},
		// More Books
		{
			ID:               "amz_15",
			Marketplace:      "AMAZON",
			Title:            "The Seven Husbands of Evelyn Hugo - Taylor Jenkins Reid",
			ImageURL:         "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
			Price:            16.99,
			Currency:         "USD",
			Rating:           4.7,
			RatingCount:      234567,
			ShippingEstimate: "Dec 6-8",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "A captivating novel about a reclusive Hollywood icon. New York Times bestseller.",
			Category:         "Books",
		},
		{
			ID:               "ebay_13",
			Marketplace:      "EBAY",
			Title:            "Project Hail Mary by Andy Weir - Hardcover",
			ImageURL:         "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
			Price:            18.50,
			Currency:         "USD",
			Rating:           4.9,
			RatingCount:      123456,
			ShippingEstimate: "Dec 7-10",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "A lone astronaut must save the earth from disaster. From the author of The Martian.",
			Category:         "Books",
		},
		// More Home & Kitchen
		{
			ID:               "amz_16",
			Marketplace:      "AMAZON",
			Title:            "KitchenAid Stand Mixer 5.5 Qt - Empire Red",
			ImageURL:         "https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=400&h=400&fit=crop",
			Price:            379.99,
			Currency:         "USD",
			Rating:           4.8,
			RatingCount:      23456,
			ShippingEstimate: "Dec 8-10",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "10 speeds. Tilt-head design. Includes flat beater, dough hook, and wire whip. Iconic design.",
			Category:         "Home",
		},
		{
			ID:               "ebay_14",
			Marketplace:      "EBAY",
			Title:            "Ninja Foodi 8-in-1 Pressure Cooker & Air Fryer",
			ImageURL:         "https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=400&h=400&fit=crop",
			Price:            199.99,
			Currency:         "USD",
			Rating:           4.7,
			RatingCount:      18901,
			ShippingEstimate: "Dec 7-9",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "8-in-1 cooking system. 6.5 quart capacity. TenderCrisp technology. 14 one-touch programs.",
			Category:         "Home",
		},
		// More Used Items
		{
			ID:               "ebay_15",
			Marketplace:      "EBAY",
			Title:            "iPhone 13 Pro 256GB - Sierra Blue (Unlocked)",
			ImageURL:         "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
			Price:            649.99,
			Currency:         "USD",
			Rating:           4.6,
			RatingCount:      1234,
			ShippingEstimate: "Dec 8-10",
			Condition:        "used",
			ShipsTo:          []string{"US", "CA"},
			Description:      "Excellent condition. 95% battery health. All original accessories. No scratches on screen.",
			Category:         "Electronics",
		},
		{
			ID:               "amz_17",
			Marketplace:      "AMAZON",
			Title:            "Sony A7 III Mirrorless Camera Body (Renewed)",
			ImageURL:         "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
			Price:            1399.00,
			Currency:         "USD",
			Rating:           4.5,
			RatingCount:      567,
			ShippingEstimate: "Dec 9-12",
			Condition:        "used",
			ShipsTo:          []string{"US"},
			Description:      "Amazon Renewed. 24.2MP full-frame sensor. 4K video. 693 phase-detection AF points. Like new condition.",
			Category:         "Electronics",
		},
		// Budget Items
		{
			ID:               "amz_18",
			Marketplace:      "AMAZON",
			Title:            "Anker Soundcore Life Q20 Wireless Headphones",
			ImageURL:         "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
			Price:            49.99,
			Currency:         "USD",
			Rating:           4.5,
			RatingCount:      45678,
			ShippingEstimate: "Dec 6-8",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "Active noise cancellation. 40-hour battery. BassUp technology. Memory foam ear cups.",
			Category:         "Electronics",
		},
		{
			ID:               "ebay_16",
			Marketplace:      "EBAY",
			Title:            "Fire TV Stick 4K Max Streaming Device",
			ImageURL:         "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
			Price:            39.99,
			Currency:         "USD",
			Rating:           4.6,
			RatingCount:      67890,
			ShippingEstimate: "Dec 5-7",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA", "UK"},
			Description:      "4K Ultra HD. Wi-Fi 6 support. Alexa Voice Remote. Dolby Vision and Atmos.",
			Category:         "Electronics",
		},
		// Premium Items
		{
			ID:               "amz_19",
			Marketplace:      "AMAZON",
			Title:            "LG 77\" Class C3 Series OLED 4K Smart TV",
			ImageURL:         "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
			Price:            2499.99,
			Currency:         "USD",
			Rating:           4.8,
			RatingCount:      1234,
			ShippingEstimate: "Dec 12-15",
			Condition:        "new",
			ShipsTo:          []string{"US"},
			Description:      "77-inch OLED display. α9 AI Processor Gen6. Dolby Vision IQ. webOS 23. Perfect blacks.",
			Category:         "Electronics",
		},
		{
			ID:               "ebay_17",
			Marketplace:      "EBAY",
			Title:            "Apple MacBook Pro 16\" M3 Max - 36GB RAM, 1TB SSD",
			ImageURL:         "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
			Price:            3499.00,
			Currency:         "USD",
			Rating:           4.9,
			RatingCount:      567,
			ShippingEstimate: "Dec 10-13",
			Condition:        "new",
			ShipsTo:          []string{"US", "CA"},
			Description:      "M3 Max chip. 16.2-inch Liquid Retina XDR display. 22-hour battery. ProRes acceleration.",
			Category:         "Computers",
		},
	}

	// Add price history to all products
	for i := range products {
		products[i].PriceHistory = generatePriceHistory(products[i].Price)
	}

	return products
}

// toTitleCase capitalizes the first letter of each word
func toTitleCase(s string) string {
	words := strings.Fields(s)
	for i, word := range words {
		if len(word) > 0 {
			words[i] = strings.ToUpper(string(word[0])) + strings.ToLower(word[1:])
		}
	}
	return strings.Join(words, " ")
}

// CORS Middleware
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// Handlers
func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Create a simple user based on email
	displayName := strings.Split(req.Email, "@")[0]
	displayName = toTitleCase(strings.ReplaceAll(displayName, ".", " "))

	user := User{
		ID:              "user_" + strconv.FormatInt(time.Now().UnixNano(), 36),
		Email:           req.Email,
		DisplayName:     displayName,
		DefaultCountry:  "US",
		DefaultCurrency: "USD",
		Favorites:       []string{},
	}

	// Store user for favorites functionality
	mockUser = user

	response := LoginResponse{
		User:  user,
		Token: "mock_token_" + strconv.FormatInt(time.Now().UnixNano(), 36),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func handleLogout(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Reset user favorites
	mockUser.Favorites = []string{}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func handleProducts(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	query := r.URL.Query()

	// Filter products
	filtered := make([]Product, 0)

	searchQuery := strings.ToLower(query.Get("q"))
	sources := query.Get("sources")
	minPriceStr := query.Get("minPrice")
	maxPriceStr := query.Get("maxPrice")
	sortBy := query.Get("sort")
	condition := query.Get("condition")
	category := query.Get("category")

	// Parse sources
	sourceList := []string{"AMAZON", "EBAY"}
	if sources != "" {
		sourceList = strings.Split(sources, ",")
	}

	// Parse price range
	minPrice := 0.0
	maxPrice := 999999.0
	if minPriceStr != "" {
		if val, err := strconv.ParseFloat(minPriceStr, 64); err == nil {
			minPrice = val
		}
	}
	if maxPriceStr != "" {
		if val, err := strconv.ParseFloat(maxPriceStr, 64); err == nil {
			maxPrice = val
		}
	}

	for _, p := range mockProducts {
		// Check marketplace source
		inSource := false
		for _, s := range sourceList {
			if strings.EqualFold(p.Marketplace, s) {
				inSource = true
				break
			}
		}
		if !inSource {
			continue
		}

		// Check search query
		if searchQuery != "" && !strings.Contains(strings.ToLower(p.Title), searchQuery) &&
			!strings.Contains(strings.ToLower(p.Description), searchQuery) &&
			!strings.Contains(strings.ToLower(p.Category), searchQuery) {
			continue
		}

		// Check price range
		if p.Price < minPrice || p.Price > maxPrice {
			continue
		}

		// Check condition
		if condition != "" && condition != "all" && p.Condition != condition {
			continue
		}

		// Check category
		if category != "" && category != "all" && !strings.EqualFold(p.Category, category) {
			continue
		}

		filtered = append(filtered, p)
	}

	// Sort
	switch sortBy {
	case "price_asc":
		sort.Slice(filtered, func(i, j int) bool {
			return filtered[i].Price < filtered[j].Price
		})
	case "rating_desc":
		sort.Slice(filtered, func(i, j int) bool {
			return filtered[i].Rating > filtered[j].Rating
		})
	case "shipping_asc":
		// Sort by shipping estimate (simple string sort for demo)
		sort.Slice(filtered, func(i, j int) bool {
			return filtered[i].ShippingEstimate < filtered[j].ShippingEstimate
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(filtered)
}

func handleProductsBatch(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req BatchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	result := make([]Product, 0)
	for _, id := range req.IDs {
		for _, p := range mockProducts {
			if p.ID == id {
				result = append(result, p)
				break
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func handleFavorites(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req FavoriteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Toggle favorite
	found := false
	newFavorites := make([]string, 0)
	for _, fav := range mockUser.Favorites {
		if fav == req.ProductID {
			found = true
			// Skip this one (remove from favorites)
		} else {
			newFavorites = append(newFavorites, fav)
		}
	}

	if !found {
		// Add to favorites
		newFavorites = append(newFavorites, req.ProductID)
	}

	mockUser.Favorites = newFavorites

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mockUser.Favorites)
}

func main() {
	// API Routes
	http.HandleFunc("/api/login", enableCORS(handleLogin))
	http.HandleFunc("/api/logout", enableCORS(handleLogout))
	http.HandleFunc("/api/products", enableCORS(handleProducts))
	http.HandleFunc("/api/products/batch", enableCORS(handleProductsBatch))
	http.HandleFunc("/api/favorites", enableCORS(handleFavorites))

	// Health check
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	port := ":8080"
	log.Printf("🚀 FIND Backend Server starting on http://localhost%s", port)
	log.Printf("📦 Loaded %d mock products", len(mockProducts))

	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}

