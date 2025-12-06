"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  BellOff,
  Trash2,
  Plus,
  Check,
  Clock,
  TrendingDown,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button, Card, Badge, MarketplaceBadge, EmptyState, Modal } from "@/components/ui";
import { formatPrice, cn } from "@/lib/utils";
import { mockProducts } from "@/lib/mockData";
import type { Product, PriceAlert } from "@/types";

// Mock alerts data
const mockAlerts: PriceAlert[] = [
  {
    id: "1",
    productId: "1",
    product: mockProducts[0],
    targetPrice: 150,
    createdAt: "2024-12-01",
    isActive: true,
    lastChecked: "2024-12-06T10:30:00Z",
  },
  {
    id: "2",
    productId: "3",
    product: mockProducts[2],
    targetPrice: 99,
    createdAt: "2024-11-28",
    isActive: true,
    lastChecked: "2024-12-06T10:30:00Z",
    triggered: true,
    triggeredAt: "2024-12-05T15:00:00Z",
  },
  {
    id: "3",
    productId: "4",
    product: mockProducts[3],
    targetPrice: 280,
    createdAt: "2024-11-25",
    isActive: false,
    lastChecked: "2024-12-06T10:30:00Z",
  },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(mockAlerts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [targetPrice, setTargetPrice] = useState("");

  const toggleAlertStatus = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  const deleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const createAlert = () => {
    if (!selectedProduct || !targetPrice) return;

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      product: selectedProduct,
      targetPrice: parseFloat(targetPrice),
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setAlerts((prev) => [...prev, newAlert]);
    setShowCreateModal(false);
    setSelectedProduct(null);
    setTargetPrice("");
  };

  const activeAlerts = alerts.filter((a) => a.isActive);
  const triggeredAlerts = alerts.filter((a) => a.triggered && a.isActive);
  const pausedAlerts = alerts.filter((a) => !a.isActive);

  if (alerts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<Bell className="w-12 h-12" />}
          title="No price alerts"
          description="Set up alerts to get notified when prices drop on your favorite products!"
          action={
            <Link href="/">
              <Button variant="primary">
                Browse Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[150px]" />
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-purple/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bell className="w-8 h-8 text-accent-cyan" />
              Price Alerts
            </h1>
            <p className="text-dark-400 mt-1">
              {activeAlerts.length} active {activeAlerts.length === 1 ? "alert" : "alerts"}
              {triggeredAlerts.length > 0 && (
                <span className="text-accent-lime ml-2">
                  • {triggeredAlerts.length} price {triggeredAlerts.length === 1 ? "drop" : "drops"}!
                </span>
              )}
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Alert
          </Button>
        </div>

        {/* Triggered Alerts Banner */}
        {triggeredAlerts.length > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-accent-lime/10 to-accent-cyan/10 border border-accent-lime/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-lime/20">
                <TrendingDown className="w-5 h-5 text-accent-lime" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Price dropped on {triggeredAlerts.length}{" "}
                  {triggeredAlerts.length === 1 ? "item" : "items"}!
                </h3>
                <p className="text-sm text-dark-300">
                  Now&apos;s your chance to grab these deals before they&apos;re gone.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-white">{alerts.length}</p>
            <p className="text-sm text-dark-400">Total Alerts</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-accent-lime">{triggeredAlerts.length}</p>
            <p className="text-sm text-dark-400">Price Drops</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-accent-cyan">{activeAlerts.length}</p>
            <p className="text-sm text-dark-400">Active</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-dark-400">{pausedAlerts.length}</p>
            <p className="text-sm text-dark-400">Paused</p>
          </Card>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={cn(
                "p-6",
                alert.triggered && "ring-1 ring-accent-lime/30",
                !alert.isActive && "opacity-60"
              )}
            >
              <div className="flex gap-6">
                {/* Product Image */}
                <Link
                  href={`/products/${alert.product.id}`}
                  className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-dark-700/50"
                >
                  <Image
                    src={alert.product.imageUrl}
                    alt={alert.product.title}
                    fill
                    className="object-contain p-2"
                  />
                  {alert.triggered && (
                    <div className="absolute inset-0 bg-accent-lime/10 flex items-center justify-center">
                      <Check className="w-8 h-8 text-accent-lime" />
                    </div>
                  )}
                </Link>

                {/* Alert Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MarketplaceBadge marketplace={alert.product.marketplace} size="sm" />
                        {alert.triggered && (
                          <Badge variant="success">Price Dropped!</Badge>
                        )}
                        {!alert.isActive && (
                          <Badge variant="default">Paused</Badge>
                        )}
                      </div>
                      <Link
                        href={`/products/${alert.product.id}`}
                        className="text-white font-medium hover:text-accent-purple transition-colors line-clamp-2"
                      >
                        {alert.product.title}
                      </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAlertStatus(alert.id)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          alert.isActive
                            ? "text-accent-cyan hover:bg-dark-700"
                            : "text-dark-400 hover:bg-dark-700"
                        )}
                        title={alert.isActive ? "Pause alert" : "Activate alert"}
                      >
                        {alert.isActive ? (
                          <Bell className="w-5 h-5" />
                        ) : (
                          <BellOff className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-dark-700 transition-colors"
                        title="Delete alert"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="flex items-center gap-6 mt-4">
                    <div>
                      <p className="text-xs text-dark-400 mb-1">Current Price</p>
                      <p
                        className={cn(
                          "text-lg font-bold",
                          alert.product.price <= alert.targetPrice
                            ? "text-accent-lime"
                            : "text-white"
                        )}
                      >
                        {formatPrice(alert.product.price, alert.product.currency)}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-dark-700" />
                    <div>
                      <p className="text-xs text-dark-400 mb-1">Target Price</p>
                      <p className="text-lg font-bold text-accent-purple">
                        {formatPrice(alert.targetPrice, alert.product.currency)}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-dark-700" />
                    <div>
                      <p className="text-xs text-dark-400 mb-1">Difference</p>
                      <p
                        className={cn(
                          "text-lg font-bold",
                          alert.product.price <= alert.targetPrice
                            ? "text-accent-lime"
                            : "text-dark-300"
                        )}
                      >
                        {alert.product.price <= alert.targetPrice ? (
                          <span className="flex items-center gap-1">
                            <TrendingDown className="w-4 h-4" />
                            {formatPrice(
                              alert.targetPrice - alert.product.price,
                              alert.product.currency
                            )}
                          </span>
                        ) : (
                          formatPrice(
                            alert.product.price - alert.targetPrice,
                            alert.product.currency
                          )
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mt-4 text-xs text-dark-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Created {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                    {alert.triggered && alert.triggeredAt && (
                      <span className="text-accent-lime">
                        Triggered on {new Date(alert.triggeredAt).toLocaleDateString()}
                      </span>
                    )}
                    <a
                      href={alert.product.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-accent-purple hover:text-accent-purple/80"
                    >
                      View Product
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Alert Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Price Alert"
      >
        <div className="space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Select a product
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {mockProducts.slice(0, 6).map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-colors",
                    selectedProduct?.id === product.id
                      ? "border-accent-purple bg-accent-purple/10"
                      : "border-dark-600/50 hover:border-dark-500"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-dark-700">
                      <Image
                        src={product.imageUrl}
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{product.title}</p>
                      <p className="text-xs text-dark-400">
                        {formatPrice(product.price, product.currency)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Price */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Target Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">$</span>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 rounded-lg bg-dark-700/50 border border-dark-600/50 text-white placeholder:text-dark-400 focus:outline-none focus:border-accent-purple/50"
              />
            </div>
            {selectedProduct && (
              <p className="mt-2 text-sm text-dark-400">
                Current price: {formatPrice(selectedProduct.price, selectedProduct.currency)}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={createAlert}
              disabled={!selectedProduct || !targetPrice}
              className="flex-1"
            >
              Create Alert
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
