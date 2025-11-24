import React from "react"
import NextLink from "next/link"
import { cn } from "@/lib/utils"
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface DashboardFooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

const currentYear = new Date().getFullYear()

function FooterLink({
  href,
  children,
  external = false,
  className,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
  className?: string
}) {
  if (external) {
    return (
      <a
        href={href}
        className={cn("text-sm text-muted-foreground hover:underline", className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }

  return (
    <NextLink href={href} className={cn("text-sm text-muted-foreground hover:underline", className)}>
      {children}
    </NextLink>
  )
}


type Orientation = "horizontal" | "vertical"
type SizeKey = "sm" | "md" | "lg"

const sizeMap: Record<SizeKey, string> = {
  sm: "h-[1px] md:h-[1px] w-full",
  md: "h-[2px] md:h-[2px] w-full",
  lg: "h-[3px] md:h-[3px] w-full",
}

/**
 * SeparatorDemo
 *
 * Expanded demo showing common Separator usages:
 * - default horizontal separator with heading
 * - inline (vertical) separators between links
 * - inset/content-wrapping separator
 * - style/size variants (including dashed)
 * - simple interactive controls to preview orientation & thickness
 */

  const [orientation, setOrientation] = useState<Orientation>("vertical")
  const [size, setSize] = useState<SizeKey>("md")
  const isVertical = orientation === "vertical"

  export function DashboardFooter({ className, ...props }: DashboardFooterProps) {
  return (
    <footer
      role="contentinfo"
      className={cn(
        "w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
      {...props}
    >
      
    <div className="space-y-6">
      {/* Header / intro */}
      <section className="space-y-1">
        <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">
          An open-source UI component library — examples of the Separator component.
        </p>
      </section>

      {/* Basic horizontal separator */}
      <div>
        <div className="space-y-2">
          <h5 className="text-sm font-semibold">Basic</h5>
          <p className="text-sm text-muted-foreground">Default horizontal separator used to group vertical content.</p>
        </div>

        <div className="mt-3">
          <div className="rounded-md bg-muted p-4">
            <div className="text-sm">Section A content</div>
            <Separator className="my-4" />
            <div className="text-sm">Section B content</div>
          </div>
        </div>
      </div>

      {/* Inline / vertical separator */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-sm font-semibold">Inline / Vertical</h5>
            <p className="text-sm text-muted-foreground">Use vertical separators to separate inline elements like links or metadata.</p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-muted-foreground">Orientation</label>
            <select
              aria-label="Separator orientation"
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as Orientation)}
              className="rounded border px-2 py-1 text-sm"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>

            <label className="text-sm text-muted-foreground">Thickness</label>
            <select
              aria-label="Separator size"
              value={size}
              onChange={(e) => setSize(e.target.value as SizeKey)}
              className="rounded border px-2 py-1 text-sm"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center space-x-4 text-sm">
          <div>Blog</div>
          {/* dynamic vertical/horizontal separator usage */}
          <Separator orientation={isVertical ? "vertical" : "horizontal"} className={isVertical ? "h-5" : "my-0"} />
          <div>Docs</div>
          <Separator orientation={isVertical ? "vertical" : "horizontal"} className={isVertical ? "h-5" : "my-0"} />
          <div>Source</div>
        </div>

        {/* Visual preview of custom thickness & dashed style */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-2">Applied thickness</div>
            <div className="rounded-md bg-surface p-3">
              <div className="text-sm">Left</div>
              <div className="my-3">
                <Separator className={`${sizeMap[size]} bg-border`} />
              </div>
              <div className="text-sm">Right</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Inset separator</div>
            <div className="rounded-md bg-surface p-3">
              <div className="text-sm">Top content</div>
              <div className="my-3">
                <Separator className="mx-6" />
              </div>
              <div className="text-sm">Bottom content</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Dashed / decorative</div>
            <div className="rounded-md bg-surface p-3">
              <div className="text-sm">Above</div>
              <div className="my-3">
                {/* dashed style using Tailwind utilities — ensure your CSS supports these or replace with your token classes */}
                <Separator className="my-1 border-t border-dashed border-muted-foreground" />
              </div>
              <div className="text-sm">Below</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content-wrapping separator with label */}
      <div>
        <h5 className="text-sm font-semibold">Content-wrapping / Labeled</h5>
        <p className="text-sm text-muted-foreground">Place a small label inside or over a separator to create a visual break with context.</p>

        <div className="mt-3 relative flex items-center">
          <div className="flex-1 h-px bg-border" />
          <span className="mx-4 rounded-full bg-background px-3 py-0.5 text-xs text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>
    </div>
  

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding / Short summary */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div
                aria-hidden
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
              >
                {/* Replace with real logo when available */}
                <span className="text-white font-semibold"></span>
              </div>
              <div>
                <h3 className="text-lg font-semibold leading-none">RunAsh.AI</h3>
                <p className="text-sm text-muted-foreground">Real-time live analytics for creators.</p>
              </div>
            </div>
            <div className="flex space-x-3 items-center">
              <FooterLink href="/status">Status</FooterLink>
              <Separator orientation="vertical" />
              <FooterLink href="/docs">Docs</FooterLink>
              <Separator orientation="vertical" />
              <FooterLink href="/help">Help</FooterLink>
            </div>
          </div>

          {/* Product links */}
          <nav aria-label="Footer navigation" className="space-y-2">
            <h4 className="text-sm font-medium">Product</h4>
            <ul className="space-y-1">
              <li>
                <FooterLink href="/features">Features</FooterLink>
              </li>
              <li>
                <FooterLink href="/pricing">Pricing</FooterLink>
              </li>
              <li>
                <FooterLink href="/integrations">Integrations</FooterLink>
              </li>
              <li>
                <FooterLink href="/roadmap">Roadmap</FooterLink>
              </li>
            </ul>
          </nav>

          {/* Resources */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Resources</h4>
            <ul className="space-y-1">
              <li>
                <FooterLink href="/blog">Blog</FooterLink>
              </li>
              <li>
                <FooterLink href="/guides">Guides</FooterLink>
              </li>
              <li>
                <FooterLink href="/support">Support</FooterLink>
              </li>
              <li>
                <FooterLink href="/learn">Learn</FooterLink>
              </li>
            </ul>
          </div>

          {/* Contact / Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Contact</h4>
            <div className="flex items-center space-x-3">
              <a
                href="mailto:hello@runash.ai"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline"
                aria-label="Email RunAsh.AI"
              >
                <Mail className="h-4 w-4" aria-hidden />
                hello@runash.ai
              </a>
            </div>

            <div>
              <h4 className="text-sm font-medium">Follow</h4>
              <div className="flex items-center space-x-3 mt-2">
                <a
                  href="https://github.com/your-org"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RunAsh.AI on GitHub"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/your-handle"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RunAsh.AI on Twitter"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/company/your-company"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RunAsh.AI on LinkedIn"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {currentYear} RunAsh.AI. All rights reserved.</p>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" aria-hidden />
            <span>for creators worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default DashboardFooter
